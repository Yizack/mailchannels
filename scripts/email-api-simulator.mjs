import { randomBytes, randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { pathToFileURL } from "node:url";

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 8787;
const SIMULATOR_SIGNING_KEY_ID = "simulator-default";
const JSON_HEADERS = {
  "content-type": "application/json"
};

const currentTimestamp = () => new Date().toISOString();

const createId = prefix => `${prefix}_${randomBytes(6).toString("hex")}`;

const clone = value => JSON.parse(JSON.stringify(value));

const readBody = async (request) => {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (!chunks.length) return null;
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return null;
  return JSON.parse(raw);
};

const sendJson = (response, statusCode, body) => {
  response.writeHead(statusCode, JSON_HEADERS);
  response.end(JSON.stringify(body));
};

const sendNoContent = (response) => {
  response.writeHead(204);
  response.end();
};

const sendText = (response, statusCode, message) => {
  response.writeHead(statusCode, { "content-type": "text/plain; charset=utf-8" });
  response.end(message);
};

const getArrayQuery = (url, name) => {
  const directValues = url.searchParams.getAll(name).flatMap(value => value.split(","));
  return directValues.map(value => value.trim()).filter(Boolean);
};

const renderTemplate = (value, data = {}) => value.replace(/\{\{\s*([^}\s]+)\s*\}\}/g, (_, key) => {
  const replacement = data[key];
  return replacement === undefined || replacement === null ? "" : String(replacement);
});

const buildRenderedMessage = (payload, personalization) => {
  const recipientList = (personalization.to || []).map(recipient => recipient.email).join(", ");
  const subject = personalization.subject || payload.subject;
  const templateData = {
    ...(payload.personalizations?.[0]?.dynamic_template_data || {}),
    ...(personalization.dynamic_template_data || {})
  };

  const content = (payload.content || [])
    .map(item => renderTemplate(item.value, templateData))
    .join("\n\n");

  return [
    `From: ${personalization.from?.email || payload.from?.email || "sender@example.com"}`,
    `To: ${recipientList}`,
    `Subject: ${subject}`,
    "",
    content
  ].join("\n");
};

const createMetricsBuckets = count => [{
  count,
  period_start: currentTimestamp()
}];

const createAccountState = apiKey => ({
  apiKey,
  customerHandle: createId("customer"),
  dkimKeysByDomain: new Map(),
  messages: [],
  subAccounts: new Map(),
  suppressionEntries: [],
  webhookBatches: [],
  webhooks: new Set(),
  webhookSigningKeys: new Map([
    [SIMULATOR_SIGNING_KEY_ID, "SIMULATOR_PUBLIC_SIGNING_KEY"]
  ]),
  nextIds: {
    apiKey: 1,
    batch: 1,
    smtpPassword: 1,
    subAccount: 1
  }
});

const createSubAccount = (account, companyName, handle) => ({
  apiKeys: [],
  company_name: companyName,
  enabled: true,
  handle: handle || `subaccount${account.nextIds.subAccount++}`,
  limit: null,
  smtpPasswords: [],
  usage: 0
});

const toDkimDnsRecord = (selector, domain, value) => ({
  name: `${selector}._domainkey.${domain}`,
  type: "TXT",
  value: `v=DKIM1; k=rsa; p=${value}`
});

const createDkimKey = (domain, selector, overrides = {}) => {
  const publicKey = Buffer.from(`${domain}:${selector}:public-key`).toString("base64");
  return {
    algorithm: "rsa",
    created_at: currentTimestamp(),
    dkim_dns_records: [toDkimDnsRecord(selector, domain, publicKey)],
    domain,
    gracePeriodExpiresAt: null,
    key_length: 2048,
    public_key: publicKey,
    retiresAt: null,
    selector,
    status: "active",
    status_modified_at: currentTimestamp(),
    ...overrides
  };
};

const listDkimKeys = (account, domain) => account.dkimKeysByDomain.get(domain) || [];

const recordWebhookBatch = (account, webhook, eventCount, status = "2xx_response", statusCode = 200) => {
  account.webhookBatches.unshift({
    batch_id: account.nextIds.batch++,
    created_at: currentTimestamp(),
    customer_handle: account.customerHandle,
    duration: {
      unit: "milliseconds",
      value: 25
    },
    event_count: eventCount,
    status,
    status_code: statusCode,
    webhook
  });
};

const collectMessages = (account, filters = {}) => {
  return account.messages.filter((message) => {
    if (filters.campaignId && message.campaignId !== filters.campaignId) return false;
    if (filters.scopeHandle !== undefined && message.scopeHandle !== filters.scopeHandle) return false;
    return true;
  });
};

const summarizeMessages = messages => ({
  bounced: messages.reduce((total, message) => total + message.bounced, 0),
  click: messages.reduce((total, message) => total + message.click, 0),
  clickTrackingDelivered: messages.reduce((total, message) => total + message.clickTrackingDelivered, 0),
  delivered: messages.reduce((total, message) => total + message.delivered, 0),
  dropped: messages.reduce((total, message) => total + message.dropped, 0),
  open: messages.reduce((total, message) => total + message.open, 0),
  openTrackingDelivered: messages.reduce((total, message) => total + message.openTrackingDelivered, 0),
  processed: messages.reduce((total, message) => total + message.processed, 0),
  unsubscribeDelivered: messages.reduce((total, message) => total + message.unsubscribeDelivered, 0),
  unsubscribed: messages.reduce((total, message) => total + message.unsubscribed, 0)
});

const createScope = () => ({
  account: null,
  handle: null,
  type: "parent"
});

export const createEmailApiSimulator = ({ host = DEFAULT_HOST, logRequests = true, port = DEFAULT_PORT } = {}) => {
  const accounts = new Map();
  const apiKeyScopes = new Map();

  const ensureParentScope = (apiKey) => {
    if (apiKeyScopes.has(apiKey)) {
      return apiKeyScopes.get(apiKey);
    }

    const account = createAccountState(apiKey);
    accounts.set(account.customerHandle, account);

    const scope = createScope();
    scope.account = account;
    apiKeyScopes.set(apiKey, scope);
    return scope;
  };

  const resolveScope = (apiKey) => {
    const scope = ensureParentScope(apiKey);
    return {
      account: scope.account,
      scopeHandle: scope.handle
    };
  };

  const notFound = response => sendJson(response, 404, { error: "Not Found" });

  const server = createServer(async (request, response) => {
    try {
      const method = request.method || "GET";
      const url = new URL(request.url || "/", `http://${request.headers.host || `${host}:${port}`}`);

      if (logRequests) {
        console.info(`[mailchannels-simulator] ${method} ${url.pathname}`);
      }

      const apiKey = request.headers["x-api-key"];
      if (typeof apiKey !== "string" || !apiKey) {
        sendJson(response, 401, { error: "Missing X-API-Key header." });
        return;
      }

      const { account, scopeHandle } = resolveScope(apiKey);
      const body = await readBody(request).catch(() => undefined);
      if (body === undefined) {
        sendJson(response, 400, { error: "Invalid JSON request body." });
        return;
      }

      if (method === "POST" && url.pathname === "/tx/v1/send") {
        const requestId = createId("request");
        const personalizations = body?.personalizations || [];
        const eventCount = personalizations.length;

        if (url.searchParams.get("dry-run") === "true") {
          sendJson(response, 200, {
            data: personalizations.map(personalization => buildRenderedMessage(body, personalization)),
            request_id: requestId
          });
          return;
        }

        const results = personalizations.map((personalization, index) => {
          const messageId = `<${randomUUID()}@simulator.mailchannels.local>`;
          const recipientCount = [
            ...(personalization.to || []),
            ...(personalization.cc || []),
            ...(personalization.bcc || [])
          ].length;

          account.messages.push({
            bounced: 0,
            campaignId: body?.campaign_id || "uncategorized",
            click: body?.tracking_settings?.click_tracking?.enable ? 1 : 0,
            clickTrackingDelivered: body?.tracking_settings?.click_tracking?.enable ? 1 : 0,
            delivered: 1,
            dropped: 0,
            open: body?.tracking_settings?.open_tracking?.enable ? 1 : 0,
            openTrackingDelivered: body?.tracking_settings?.open_tracking?.enable ? 1 : 0,
            processed: 1,
            recipientCount,
            requestId,
            scopeHandle,
            timestamp: currentTimestamp(),
            unsubscribeDelivered: body?.transactional === false ? 1 : 0,
            unsubscribed: 0
          });

          if (scopeHandle) {
            const subAccount = account.subAccounts.get(scopeHandle);
            if (subAccount) {
              subAccount.usage += 1;
            }
          }

          return {
            index,
            message_id: messageId,
            status: "sent"
          };
        });

        for (const webhook of account.webhooks) {
          recordWebhookBatch(account, webhook, eventCount);
        }

        sendJson(response, 200, {
          request_id: requestId,
          results
        });
        return;
      }

      if (method === "POST" && url.pathname === "/tx/v1/send-async") {
        const eventCount = body?.personalizations?.length || 0;
        for (const webhook of account.webhooks) {
          recordWebhookBatch(account, webhook, eventCount);
        }

        sendJson(response, 202, {
          queued_at: currentTimestamp(),
          request_id: createId("request")
        });
        return;
      }

      if (method === "POST" && url.pathname === "/tx/v1/check-domain") {
        const domain = body?.domain || "example.com";
        const dkimSettings = body?.dkim_settings?.length? body.dkim_settings: listDkimKeys(account, domain).map(key => ({
          dkim_domain: key.domain,
          dkim_selector: key.selector
        }));

        sendJson(response, 200, {
          check_results: {
            dkim: dkimSettings.map(setting => ({
              dkim_domain: setting.dkim_domain || domain,
              dkim_key_status: setting.dkim_private_key ? "provided" : (listDkimKeys(account, setting.dkim_domain || domain).find(key => key.selector === setting.dkim_selector)?.status || "active"),
              dkim_selector: setting.dkim_selector || "default",
              verdict: "passed"
            })),
            domain_lockdown: {
              verdict: "passed"
            },
            sender_domain: {
              a: { verdict: "passed" },
              mx: { verdict: "passed" },
              verdict: "passed"
            },
            spf: {
              verdict: "passed"
            }
          }
        });
        return;
      }

      const dkimCollectionMatch = url.pathname.match(/^\/tx\/v1\/domains\/([^/]+)\/dkim-keys$/);
      if (dkimCollectionMatch) {
        const [, domain] = dkimCollectionMatch;

        if (method === "POST") {
          const key = createDkimKey(domain, body?.selector || createId("selector"), {
            algorithm: body?.algorithm || "rsa",
            key_length: body?.key_length || 2048
          });

          account.dkimKeysByDomain.set(domain, [...listDkimKeys(account, domain), key]);
          sendJson(response, 201, key);
          return;
        }

        if (method === "GET") {
          const selector = url.searchParams.get("selector");
          const status = url.searchParams.get("status");
          const offset = Number(url.searchParams.get("offset") || "0");
          const limit = Number(url.searchParams.get("limit") || "10");

          let keys = listDkimKeys(account, domain);
          if (selector) {
            keys = keys.filter(key => key.selector === selector);
          }
          if (status) {
            keys = keys.filter(key => key.status === status);
          }

          sendJson(response, 200, {
            keys: keys.slice(offset, offset + limit)
          });
          return;
        }
      }

      const rotateDkimMatch = url.pathname.match(/^\/tx\/v1\/domains\/([^/]+)\/dkim-keys\/([^/]+)\/rotate$/);
      if (rotateDkimMatch && method === "POST") {
        const [, domain, selector] = rotateDkimMatch;
        const keys = listDkimKeys(account, domain);
        const targetKey = keys.find(key => key.selector === selector);
        if (!targetKey) {
          sendJson(response, 404, { error: "Specified key pair not found." });
          return;
        }

        targetKey.status = "rotated";
        targetKey.status_modified_at = currentTimestamp();
        targetKey.gracePeriodExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        targetKey.retiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        const newKey = createDkimKey(domain, body?.new_key?.selector || createId("selector"));
        account.dkimKeysByDomain.set(domain, [...keys, newKey]);

        sendJson(response, 201, {
          new_key: newKey,
          rotated_key: targetKey
        });
        return;
      }

      const dkimItemMatch = url.pathname.match(/^\/tx\/v1\/domains\/([^/]+)\/dkim-keys\/([^/]+)$/);
      if (dkimItemMatch && method === "PATCH") {
        const [, domain, selector] = dkimItemMatch;
        const targetKey = listDkimKeys(account, domain).find(key => key.selector === selector);
        if (!targetKey) {
          sendJson(response, 404, { error: "Specified key pair not found." });
          return;
        }

        targetKey.status = body?.status || targetKey.status;
        targetKey.status_modified_at = currentTimestamp();
        sendNoContent(response);
        return;
      }

      if (url.pathname === "/tx/v1/webhook" && method === "POST") {
        const endpoint = url.searchParams.get("endpoint");
        if (!endpoint) {
          sendJson(response, 400, { error: "Missing endpoint query parameter." });
          return;
        }

        if (account.webhooks.has(endpoint)) {
          sendJson(response, 409, { error: "Webhook already enrolled." });
          return;
        }

        account.webhooks.add(endpoint);
        response.writeHead(201);
        response.end();
        return;
      }

      if (url.pathname === "/tx/v1/webhook" && method === "GET") {
        sendJson(response, 200, Array.from(account.webhooks).map(webhook => ({ webhook })));
        return;
      }

      if (url.pathname === "/tx/v1/webhook" && method === "DELETE") {
        account.webhooks.clear();
        sendNoContent(response);
        return;
      }

      if (url.pathname === "/tx/v1/webhook/public-key" && method === "GET") {
        const id = url.searchParams.get("id") || SIMULATOR_SIGNING_KEY_ID;
        const key = account.webhookSigningKeys.get(id) || "SIMULATOR_PUBLIC_SIGNING_KEY";
        account.webhookSigningKeys.set(id, key);
        sendJson(response, 200, { id, key });
        return;
      }

      if (url.pathname === "/tx/v1/webhook/validate" && method === "POST") {
        if (!account.webhooks.size) {
          sendJson(response, 404, { error: "No webhooks found for the account." });
          return;
        }

        const results = Array.from(account.webhooks).map((webhook) => {
          recordWebhookBatch(account, webhook, 1);
          return {
            result: "passed",
            webhook,
            response: {
              body: "simulated validation ok",
              status: 200
            }
          };
        });

        sendJson(response, 200, {
          all_passed: true,
          results
        });
        return;
      }

      if (url.pathname === "/tx/v1/webhook-batch" && method === "GET") {
        const createdAfter = url.searchParams.get("created_after");
        const createdBefore = url.searchParams.get("created_before");
        const statuses = getArrayQuery(url, "statuses");
        const webhook = url.searchParams.get("webhook");
        const limit = Number(url.searchParams.get("limit") || "500");
        const offset = Number(url.searchParams.get("offset") || "0");

        const batches = account.webhookBatches.filter((batch) => {
          if (createdAfter && batch.created_at < createdAfter) return false;
          if (createdBefore && batch.created_at >= createdBefore) return false;
          if (webhook && batch.webhook !== webhook) return false;
          if (statuses.length) {
            const normalizedStatuses = statuses.map(status => `${status}_response`.replace("no_response_response", "no_response"));
            if (!normalizedStatuses.includes(batch.status)) return false;
          }
          return true;
        });

        sendJson(response, 200, {
          webhook_batches: batches.slice(offset, offset + limit)
        });
        return;
      }

      const webhookBatchResendMatch = url.pathname.match(/^\/tx\/v1\/webhook-batch\/(\d+)\/resend$/);
      if (webhookBatchResendMatch && method === "POST") {
        const batchId = Number(webhookBatchResendMatch[1]);
        const batch = account.webhookBatches.find(batch => batch.batch_id === batchId);
        if (!batch) {
          sendJson(response, 404, { error: "Specified batch not found." });
          return;
        }

        recordWebhookBatch(account, batch.webhook, batch.event_count);
        sendJson(response, 200, {
          batch_id: batch.batch_id,
          customer_handle: account.customerHandle,
          webhook: batch.webhook,
          status_code: 200,
          duration_in_ms: 25,
          event_count: batch.event_count
        });
      }

      if (url.pathname === "/tx/v1/sub-account" && method === "POST") {
        const subAccount = createSubAccount(account, body?.company_name || "Simulator Company", body?.handle);
        account.subAccounts.set(subAccount.handle, subAccount);
        sendJson(response, 201, clone(subAccount));
        return;
      }

      if (url.pathname === "/tx/v1/sub-account" && method === "GET") {
        sendJson(response, 200, Array.from(account.subAccounts.values()).map(subAccount => ({
          company_name: subAccount.company_name,
          enabled: subAccount.enabled,
          handle: subAccount.handle
        })));
        return;
      }

      const subAccountMatch = url.pathname.match(/^\/tx\/v1\/sub-account\/([^/]+)(?:\/(.+))?$/);
      if (subAccountMatch) {
        const [, handle, suffix = ""] = subAccountMatch;
        const subAccount = account.subAccounts.get(handle);
        if (!subAccount) {
          sendJson(response, 404, { error: `Sub-account '${handle}' not found.` });
          return;
        }

        if (!suffix && method === "DELETE") {
          account.subAccounts.delete(handle);
          sendNoContent(response);
          return;
        }

        if (suffix === "suspend" && method === "POST") {
          subAccount.enabled = false;
          sendNoContent(response);
          return;
        }

        if (suffix === "activate" && method === "POST") {
          subAccount.enabled = true;
          sendNoContent(response);
          return;
        }

        if (suffix === "api-key" && method === "POST") {
          const apiKeyId = subAccount.apiKeys.length ? Math.max(...subAccount.apiKeys.map(key => key.id)) + 1 : account.nextIds.apiKey++;
          const keyValue = createId(`subkey_${handle}`);
          subAccount.apiKeys.push({ id: apiKeyId, key: keyValue });

          const scope = {
            account,
            handle,
            type: "sub-account"
          };
          apiKeyScopes.set(keyValue, scope);

          sendJson(response, 201, { id: apiKeyId, key: keyValue });
          return;
        }

        if (suffix === "api-key" && method === "GET") {
          sendJson(response, 200, clone(subAccount.apiKeys));
          return;
        }

        const apiKeyItemMatch = suffix.match(/^api-key\/(\d+)$/);
        if (apiKeyItemMatch && method === "DELETE") {
          const apiKeyId = Number(apiKeyItemMatch[1]);
          const deletedKey = subAccount.apiKeys.find(key => key.id === apiKeyId);
          subAccount.apiKeys = subAccount.apiKeys.filter(key => key.id !== apiKeyId);
          if (deletedKey) {
            apiKeyScopes.delete(deletedKey.key);
          }
          sendNoContent(response);
          return;
        }

        if (suffix === "smtp-password" && method === "POST") {
          const smtpPassword = {
            enabled: true,
            id: account.nextIds.smtpPassword++,
            smtp_password: createId(`smtp_${handle}`)
          };
          subAccount.smtpPasswords.push(smtpPassword);
          sendJson(response, 201, clone(smtpPassword));
          return;
        }

        if (suffix === "smtp-password" && method === "GET") {
          sendJson(response, 200, clone(subAccount.smtpPasswords));
          return;
        }

        const smtpPasswordItemMatch = suffix.match(/^smtp-password\/(\d+)$/);
        if (smtpPasswordItemMatch && method === "DELETE") {
          const smtpPasswordId = Number(smtpPasswordItemMatch[1]);
          subAccount.smtpPasswords = subAccount.smtpPasswords.filter(password => password.id !== smtpPasswordId);
          sendNoContent(response);
          return;
        }

        if (suffix === "limit" && method === "GET") {
          sendJson(response, 200, subAccount.limit || { sends: -1 });
          return;
        }

        if (suffix === "limit" && method === "PUT") {
          subAccount.limit = body || { sends: -1 };
          sendNoContent(response);
          return;
        }

        if (suffix === "limit" && method === "DELETE") {
          subAccount.limit = null;
          sendNoContent(response);
          return;
        }

        if (suffix === "usage" && method === "GET") {
          sendJson(response, 200, {
            period_end_date: currentTimestamp(),
            period_start_date: new Date(new Date().setDate(1)).toISOString(),
            total_usage: subAccount.usage
          });
          return;
        }
      }

      if (url.pathname === "/tx/v1/metrics/engagement" && method === "GET") {
        const messages = collectMessages(account, {
          campaignId: url.searchParams.get("campaign_id") || undefined
        });
        const summary = summarizeMessages(messages);
        sendJson(response, 200, {
          buckets: {
            click: createMetricsBuckets(summary.click),
            click_tracking_delivered: createMetricsBuckets(summary.clickTrackingDelivered),
            open: createMetricsBuckets(summary.open),
            open_tracking_delivered: createMetricsBuckets(summary.openTrackingDelivered)
          },
          click: summary.click,
          click_tracking_delivered: summary.clickTrackingDelivered,
          end_time: url.searchParams.get("end_time") || currentTimestamp(),
          open: summary.open,
          open_tracking_delivered: summary.openTrackingDelivered,
          start_time: url.searchParams.get("start_time") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        });
        return;
      }

      if (url.pathname === "/tx/v1/metrics/performance" && method === "GET") {
        const messages = collectMessages(account, {
          campaignId: url.searchParams.get("campaign_id") || undefined
        });
        const summary = summarizeMessages(messages);
        sendJson(response, 200, {
          bounced: summary.bounced,
          buckets: {
            bounced: createMetricsBuckets(summary.bounced),
            delivered: createMetricsBuckets(summary.delivered),
            processed: createMetricsBuckets(summary.processed)
          },
          delivered: summary.delivered,
          end_time: url.searchParams.get("end_time") || currentTimestamp(),
          processed: summary.processed,
          start_time: url.searchParams.get("start_time") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        });
        return;
      }

      if (url.pathname === "/tx/v1/metrics/recipient-behaviour" && method === "GET") {
        const messages = collectMessages(account, {
          campaignId: url.searchParams.get("campaign_id") || undefined
        });
        const summary = summarizeMessages(messages);
        sendJson(response, 200, {
          buckets: {
            unsubscribe_delivered: createMetricsBuckets(summary.unsubscribeDelivered),
            unsubscribed: createMetricsBuckets(summary.unsubscribed)
          },
          end_time: url.searchParams.get("end_time") || currentTimestamp(),
          start_time: url.searchParams.get("start_time") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          unsubscribe_delivered: summary.unsubscribeDelivered,
          unsubscribed: summary.unsubscribed
        });
        return;
      }

      if (url.pathname === "/tx/v1/metrics/volume" && method === "GET") {
        const messages = collectMessages(account, {
          campaignId: url.searchParams.get("campaign_id") || undefined
        });
        const summary = summarizeMessages(messages);
        sendJson(response, 200, {
          buckets: {
            delivered: createMetricsBuckets(summary.delivered),
            dropped: createMetricsBuckets(summary.dropped),
            processed: createMetricsBuckets(summary.processed)
          },
          delivered: summary.delivered,
          dropped: summary.dropped,
          end_time: url.searchParams.get("end_time") || currentTimestamp(),
          processed: summary.processed,
          start_time: url.searchParams.get("start_time") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        });
        return;
      }

      const senderMetricsMatch = url.pathname.match(/^\/tx\/v1\/metrics\/senders\/([^/]+)$/);
      if (senderMetricsMatch && method === "GET") {
        const [, senderType] = senderMetricsMatch;
        const limit = Number(url.searchParams.get("limit") || "10");
        const offset = Number(url.searchParams.get("offset") || "0");
        const sortOrder = url.searchParams.get("sort_order") || "desc";

        const senders = senderType === "campaigns"? Array.from(collectMessages(account).reduce((map, message) => {
          const name = message.campaignId || "uncategorized";
          const current = map.get(name) || { bounced: 0, delivered: 0, dropped: 0, name, processed: 0 };
          current.bounced += message.bounced;
          current.delivered += message.delivered;
          current.dropped += message.dropped;
          current.processed += message.processed;
          map.set(name, current);
          return map;
        }, new Map()).values()): Array.from(account.subAccounts.values()).map(subAccount => ({
          bounced: 0,
          delivered: subAccount.usage,
          dropped: 0,
          name: subAccount.handle,
          processed: subAccount.usage
        }));

        senders.sort((left, right) => {
          const direction = sortOrder === "asc" ? 1 : -1;
          return direction * (left.processed - right.processed);
        });

        sendJson(response, 200, {
          end_time: currentTimestamp(),
          limit,
          offset,
          senders: senders.slice(offset, offset + limit),
          start_time: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          total: senders.length
        });
        return;
      }

      if (url.pathname === "/tx/v1/usage" && method === "GET") {
        sendJson(response, 200, {
          period_end_date: currentTimestamp(),
          period_start_date: new Date(new Date().setDate(1)).toISOString(),
          total_usage: account.messages.length
        });
        return;
      }

      if (url.pathname === "/tx/v1/suppression-list" && method === "POST") {
        const entries = body?.suppression_entries || [];
        for (const entry of entries) {
          account.suppressionEntries.push({
            created_at: currentTimestamp(),
            notes: entry.notes,
            recipient: entry.recipient,
            sender: undefined,
            source: "api",
            suppression_types: entry.suppression_types || ["non-transactional"]
          });
        }
        sendNoContent(response);
        return;
      }

      if (url.pathname === "/tx/v1/suppression-list" && method === "GET") {
        const recipient = url.searchParams.get("recipient");
        const source = url.searchParams.get("source");
        const limit = Number(url.searchParams.get("limit") || "1000");
        const offset = Number(url.searchParams.get("offset") || "0");

        let suppressionList = account.suppressionEntries;
        if (recipient) {
          suppressionList = suppressionList.filter(entry => entry.recipient === recipient);
        }
        if (source) {
          suppressionList = suppressionList.filter(entry => entry.source === source);
        }

        sendJson(response, 200, {
          suppression_list: suppressionList.slice(offset, offset + limit)
        });
        return;
      }

      const suppressionDeleteMatch = url.pathname.match(/^\/tx\/v1\/suppression-list\/recipients\/([^/]+)$/);
      if (suppressionDeleteMatch && method === "DELETE") {
        const [, recipient] = suppressionDeleteMatch;
        const source = url.searchParams.get("source");
        account.suppressionEntries = account.suppressionEntries.filter((entry) => {
          if (entry.recipient !== decodeURIComponent(recipient)) return true;
          if (!source || source === "all") return false;
          return entry.source !== source;
        });
        sendNoContent(response);
        return;
      }

      notFound(response);
    }
    catch (error) {
      const message = error instanceof Error ? error.message : "Simulator error";
      sendText(response, 500, message);
    }
  });

  return {
    server,
    state: {
      accounts,
      apiKeyScopes
    },
    url: null,
    async close () {
      await new Promise((resolve, reject) => {
        server.close(error => error ? reject(error) : resolve());
      });
    },
    async listen (listenOptions = {}) {
      const nextHost = listenOptions.host || host;
      const nextPort = listenOptions.port ?? port;

      await new Promise((resolve, reject) => {
        server.listen(nextPort, nextHost, error => error ? reject(error) : resolve());
      });

      const address = server.address();
      const actualPort = typeof address === "object" && address ? address.port : nextPort;
      this.url = `http://${nextHost}:${actualPort}`;

      if (logRequests) {
        console.info(`[mailchannels-simulator] listening on ${this.url}`);
      }

      return this.url;
    }
  };
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.MAILCHANNELS_SIMULATOR_PORT || DEFAULT_PORT);
  const host = process.env.MAILCHANNELS_SIMULATOR_HOST || DEFAULT_HOST;
  const simulator = createEmailApiSimulator({ host, port });

  await simulator.listen();

  const shutdown = async () => {
    await simulator.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
