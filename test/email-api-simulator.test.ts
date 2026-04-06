import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { MailChannels } from "../src/mailchannels";
import { createEmailApiSimulator } from "../scripts/email-api-simulator.js";

type EmailApiSimulator = {
  close: () => Promise<void>;
  listen: (listenOptions?: { host?: string, port?: number }) => Promise<string | null>;
};

describe("Email API simulator", () => {
  const parentApiKey = "local-parent-key";
  const webhookEndpoint = "http://127.0.0.1:9999/webhooks/mailchannels";

  let baseUrl = "";
  let simulator: EmailApiSimulator;

  beforeAll(async () => {
    simulator = createEmailApiSimulator({
      logRequests: false,
      port: 0
    });
    const simulatorUrl = await simulator.listen();
    if (!simulatorUrl) throw new Error("Expected the email API simulator to return a listening URL.");
    baseUrl = simulatorUrl;
  });

  afterAll(async () => {
    await simulator.close();
  });

  it("should support the primary email and webhook flows against a local server", async () => {
    const mailchannels = new MailChannels(parentApiKey, { baseUrl });

    const dkimKey = await mailchannels.emails.createDkimKey("example.com", {
      selector: "mailchannels"
    });
    expect(dkimKey.error).toBeNull();
    expect(dkimKey.key?.selector).toBe("mailchannels");

    const sendResult = await mailchannels.emails.send({
      campaignId: "welcome-campaign",
      dkim: {
        domain: "example.com",
        selector: "mailchannels"
      },
      from: "sender@example.com",
      html: "<p>Hello {{name}}</p>",
      personalizations: [{
        headers: {
          "X-Customer": "simulator"
        },
        mustaches: {
          name: "Alice"
        },
        subject: "Welcome Alice",
        to: "alice@example.com"
      }],
      subject: "Welcome"
    });

    expect(sendResult.success).toBe(true);
    expect(sendResult.data?.requestId).toBeTruthy();
    expect(sendResult.data?.results?.[0]?.status).toBe("sent");

    const dryRunResult = await mailchannels.emails.send({
      from: "sender@example.com",
      html: "<p>Hello {{name}}</p>",
      personalizations: [{
        mustaches: {
          name: "Bob"
        },
        to: "bob@example.com"
      }],
      subject: "Dry Run"
    }, true);

    expect(dryRunResult.success).toBe(true);
    expect(dryRunResult.data?.rendered?.[0]).toContain("Hello Bob");

    const sendAsyncResult = await mailchannels.emails.sendAsync({
      from: "sender@example.com",
      html: "<p>Queued</p>",
      to: "queued@example.com",
      subject: "Queued"
    });
    expect(sendAsyncResult.success).toBe(true);
    expect(sendAsyncResult.data?.queuedAt).toBeTruthy();

    const checkDomainResult = await mailchannels.emails.checkDomain({
      domain: "example.com"
    });
    expect(checkDomainResult.error).toBeNull();
    expect(checkDomainResult.results?.spf.verdict).toBe("passed");

    const getDkimKeysResult = await mailchannels.emails.getDkimKeys("example.com", {
      includeDnsRecord: true
    });
    expect(getDkimKeysResult.error).toBeNull();
    expect(getDkimKeysResult.keys.length).toBeGreaterThan(0);

    const rotateDkimKeyResult = await mailchannels.emails.rotateDkimKey("example.com", {
      newSelector: "mailchannels-next",
      selector: "mailchannels"
    });
    expect(rotateDkimKeyResult.error).toBeNull();
    expect(rotateDkimKeyResult.newKey?.selector).toBe("mailchannels-next");
    expect(rotateDkimKeyResult.rotatedKey?.status).toBe("rotated");

    const updateDkimKeyResult = await mailchannels.emails.updateDkimKey("example.com", {
      selector: "mailchannels-next",
      status: "revoked"
    });
    expect(updateDkimKeyResult).toEqual({
      success: true,
      error: null
    });

    const enrollResult = await mailchannels.webhooks.enroll(webhookEndpoint);
    expect(enrollResult).toEqual({
      success: true,
      error: null
    });

    const listWebhooksResult = await mailchannels.webhooks.list();
    expect(listWebhooksResult.webhooks).toContain(webhookEndpoint);

    const signingKeyResult = await mailchannels.webhooks.getSigningKey("simulator-default");
    expect(signingKeyResult.key).toBe("SIMULATOR_PUBLIC_SIGNING_KEY");

    const validateWebhooksResult = await mailchannels.webhooks.validate("sim-test-request");
    expect(validateWebhooksResult.allPassed).toBe(true);
    expect(validateWebhooksResult.results[0]?.response?.status).toBe(200);

    const listBatchesResult = await mailchannels.webhooks.listBatches({
      limit: 10,
      statuses: ["2xx"]
    });
    expect(listBatchesResult.error).toBeNull();
    expect(listBatchesResult.batches.length).toBeGreaterThan(0);
    expect(listBatchesResult.batches[0]?.status).toBe("2xx_response");

    const deleteWebhooksResult = await mailchannels.webhooks.delete();
    expect(deleteWebhooksResult.success).toBe(true);
  });

  it("should support sub-account, metrics, and suppression workflows against a local server", async () => {
    const mailchannels = new MailChannels(parentApiKey, { baseUrl });

    const parentSendResult = await mailchannels.emails.send({
      campaignId: "welcome-campaign",
      from: "sender@example.com",
      html: "<p>Parent campaign</p>",
      to: "parent@example.com",
      subject: "Parent campaign"
    });
    expect(parentSendResult.success).toBe(true);

    const createSubAccountResult = await mailchannels.subAccounts.create("Simulator Company", "simacct");
    expect(createSubAccountResult.account?.handle).toBe("simacct");

    const listSubAccountsResult = await mailchannels.subAccounts.list();
    expect(listSubAccountsResult.accounts.some(account => account.handle === "simacct")).toBe(true);

    const createApiKeyResult = await mailchannels.subAccounts.createApiKey("simacct");
    expect(createApiKeyResult.key?.value).toBeTruthy();
    const createdApiKey = createApiKeyResult.key;
    if (!createdApiKey) throw new Error("Expected the simulator to create a sub-account API key.");

    const listApiKeysResult = await mailchannels.subAccounts.listApiKeys("simacct");
    expect(listApiKeysResult.keys.length).toBe(1);
    const apiKey = listApiKeysResult.keys.at(0);
    expect(apiKey).toBeDefined();
    if (!apiKey) throw new Error("Expected an API key for the simulator sub-account.");

    const createSmtpPasswordResult = await mailchannels.subAccounts.createSmtpPassword("simacct");
    expect(createSmtpPasswordResult.password?.value).toBeTruthy();

    const listSmtpPasswordsResult = await mailchannels.subAccounts.listSmtpPasswords("simacct");
    expect(listSmtpPasswordsResult.passwords.length).toBe(1);
    const smtpPassword = listSmtpPasswordsResult.passwords.at(0);
    expect(smtpPassword).toBeDefined();
    if (!smtpPassword) throw new Error("Expected an SMTP password for the simulator sub-account.");

    const getLimitBeforeResult = await mailchannels.subAccounts.getLimit("simacct");
    expect(getLimitBeforeResult.limit?.sends).toBe(-1);

    const setLimitResult = await mailchannels.subAccounts.setLimit("simacct", { sends: 42 });
    expect(setLimitResult.success).toBe(true);

    const getLimitAfterResult = await mailchannels.subAccounts.getLimit("simacct");
    expect(getLimitAfterResult.limit?.sends).toBe(42);

    const subAccountClient = new MailChannels(createdApiKey.value, { baseUrl });
    const subAccountSendResult = await subAccountClient.emails.send({
      campaignId: "sub-account-campaign",
      from: "sender@example.com",
      html: "<p>Sub-account mail</p>",
      to: "child@example.com",
      subject: "Sub-account"
    });
    expect(subAccountSendResult.success).toBe(true);

    const usageResult = await mailchannels.metrics.usage();
    expect((usageResult.usage?.total || 0) >= 1).toBe(true);

    const engagementResult = await mailchannels.metrics.engagement({
      campaignId: "welcome-campaign"
    });
    expect(engagementResult.engagement?.openTrackingDelivered).toBeDefined();

    const performanceResult = await mailchannels.metrics.performance();
    expect(performanceResult.performance?.processed).toBeDefined();

    const recipientBehaviourResult = await mailchannels.metrics.recipientBehaviour();
    expect(recipientBehaviourResult.behaviour?.unsubscribeDelivered).toBeDefined();

    const volumeResult = await mailchannels.metrics.volume();
    expect(volumeResult.volume?.delivered).toBeDefined();

    const senderCampaignsResult = await mailchannels.metrics.senderMetrics("campaigns");
    expect(senderCampaignsResult.senders.some(sender => sender.name === "welcome-campaign")).toBe(true);

    const senderSubAccountsResult = await mailchannels.metrics.senderMetrics("sub-accounts");
    expect(senderSubAccountsResult.senders.some(sender => sender.name === "simacct")).toBe(true);

    const createSuppressionResult = await mailchannels.suppressions.create({
      entries: [{
        notes: "local simulator",
        recipient: "suppressed@example.com"
      }]
    });
    expect(createSuppressionResult.success).toBe(true);

    const listSuppressionsResult = await mailchannels.suppressions.list({
      recipient: "suppressed@example.com"
    });
    expect(listSuppressionsResult.list).toHaveLength(1);

    const deleteSuppressionResult = await mailchannels.suppressions.delete("suppressed@example.com", "all");
    expect(deleteSuppressionResult.success).toBe(true);

    const subAccountUsageResult = await mailchannels.subAccounts.getUsage("simacct");
    expect((subAccountUsageResult.usage?.total || 0) >= 1).toBe(true);

    expect((await mailchannels.subAccounts.suspend("simacct")).success).toBe(true);
    expect((await mailchannels.subAccounts.activate("simacct")).success).toBe(true);
    expect((await mailchannels.subAccounts.deleteLimit("simacct")).success).toBe(true);
    expect((await mailchannels.subAccounts.deleteApiKey("simacct", apiKey.id)).success).toBe(true);
    expect((await mailchannels.subAccounts.deleteSmtpPassword("simacct", smtpPassword.id)).success).toBe(true);
    expect((await mailchannels.subAccounts.delete("simacct")).success).toBe(true);
  });
});
