import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EMAIL_SPEC_URL = "https://docs.mailchannels.net/email-api.yaml";
const INBOUND_SPEC_URL = "https://docs.mailchannels.net/inbound-api.yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const emailSpecPath = path.join(rootDir, "docs/.openapi/email-api.yaml");
const inboundSpecPath = path.join(rootDir, "docs/.openapi/inbound-api.yaml");
const emailFixturePath = path.join(rootDir, "test/fixtures/email-api-endpoints.json");
const inboundFixturePath = path.join(rootDir, "test/fixtures/inbound-api-endpoints.json");

const emailMethodMap = {
  "POST /check-domain": { module: "emails", method: "checkDomain" },
  "POST /domains/{domain}/dkim-keys": { module: "emails", method: "createDkimKey" },
  "GET /domains/{domain}/dkim-keys": { module: "emails", method: "getDkimKeys" },
  "POST /domains/{domain}/dkim-keys/{selector}/rotate": { module: "emails", method: "rotateDkimKey" },
  "PATCH /domains/{domain}/dkim-keys/{selector}": { module: "emails", method: "updateDkimKey" },
  "GET /metrics/engagement": { module: "metrics", method: "engagement" },
  "GET /metrics/performance": { module: "metrics", method: "performance" },
  "GET /metrics/recipient-behaviour": { module: "metrics", method: "recipientBehaviour" },
  "GET /metrics/senders/{sender_type}": { module: "metrics", method: "senderMetrics" },
  "GET /metrics/volume": { module: "metrics", method: "volume" },
  "POST /send": { module: "emails", method: "send" },
  "POST /send-async": { module: "emails", method: "sendAsync" },
  "POST /sub-account": { module: "subAccounts", method: "create" },
  "GET /sub-account": { module: "subAccounts", method: "list" },
  "DELETE /sub-account/{handle}": { module: "subAccounts", method: "delete" },
  "POST /sub-account/{handle}/activate": { module: "subAccounts", method: "activate" },
  "GET /sub-account/{handle}/api-key": { module: "subAccounts", method: "listApiKeys" },
  "POST /sub-account/{handle}/api-key": { module: "subAccounts", method: "createApiKey" },
  "DELETE /sub-account/{handle}/api-key/{id}": { module: "subAccounts", method: "deleteApiKey" },
  "DELETE /sub-account/{handle}/limit": { module: "subAccounts", method: "deleteLimit" },
  "GET /sub-account/{handle}/limit": { module: "subAccounts", method: "getLimit" },
  "PUT /sub-account/{handle}/limit": { module: "subAccounts", method: "setLimit" },
  "GET /sub-account/{handle}/smtp-password": { module: "subAccounts", method: "listSmtpPasswords" },
  "POST /sub-account/{handle}/smtp-password": { module: "subAccounts", method: "createSmtpPassword" },
  "DELETE /sub-account/{handle}/smtp-password/{id}": { module: "subAccounts", method: "deleteSmtpPassword" },
  "POST /sub-account/{handle}/suspend": { module: "subAccounts", method: "suspend" },
  "GET /sub-account/{handle}/usage": { module: "subAccounts", method: "getUsage" },
  "POST /suppression-list": { module: "suppressions", method: "create" },
  "GET /suppression-list": { module: "suppressions", method: "list" },
  "DELETE /suppression-list/recipients/{recipient}": { module: "suppressions", method: "delete" },
  "GET /usage": { module: "metrics", method: "usage" },
  "DELETE /webhook": { module: "webhooks", method: "delete" },
  "GET /webhook": { module: "webhooks", method: "list" },
  "POST /webhook": { module: "webhooks", method: "enroll" },
  "GET /webhook-batch": { module: "webhooks", method: "listBatches" },
  "GET /webhook/public-key": { module: "webhooks", method: "getSigningKey" },
  "POST /webhook/validate": { module: "webhooks", method: "validate" }
};

const inboundMethodMap = {
  "POST /domains": { module: "domains", method: "provision" },
  "GET /domains": { module: "domains", method: "list" },
  "POST /domains/batch": { module: "domains", method: "bulkProvision" },
  "POST /domains/batch/login-link": { module: "domains", method: "bulkCreateLoginLinks" },
  "DELETE /domains/{domain}": { module: "domains", method: "delete" },
  "GET /domains/{domain}/downstream-address": { module: "domains", method: "listDownstreamAddresses" },
  "PUT /domains/{domain}/downstream-address": { module: "domains", method: "setDownstreamAddress" },
  "GET /domains/{domain}/lists/{listname}": { module: "domains", method: "listEntries" },
  "POST /domains/{domain}/lists/{listname}": { module: "domains", method: "addListEntry" },
  "DELETE /domains/{domain}/lists/{listname}": { module: "domains", method: "deleteListEntry" },
  "GET /domains/{domain}/login-link": { module: "domains", method: "createLoginLink" },
  "PUT /domains/{domain}/api-key": { module: "domains", method: "updateApiKey" },
  "GET /lists/{listname}": { module: "lists", method: "listEntries" },
  "POST /lists/{listname}": { module: "lists", method: "addListEntry" },
  "DELETE /lists/{listname}": { module: "lists", method: "deleteListEntry" },
  "POST /report": { module: "service", method: "report" },
  "GET /status": { module: "service", method: "status" },
  "GET /subscriptions": { module: "service", method: "subscriptions" },
  "PUT /users": { module: "users", method: "create" },
  "GET /users/{email}/lists/{listname}": { module: "users", method: "listEntries" },
  "POST /users/{email}/lists/{listname}": { module: "users", method: "addListEntry" },
  "DELETE /users/{email}/lists/{listname}": { module: "users", method: "deleteListEntry" }
};

const refreshSpecs = process.argv.includes("--refresh-specs");

const normalizeYamlScalar = value => value
  .trim()
  .replace(/^['"]|['"]$/g, "");

const fetchText = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.text();
};

const parseYamlOperations = (yaml) => {
  const operations = [];
  const lines = yaml.split(/\r?\n/);
  let activeTopLevel = "";
  let currentPath = null;
  let version = null;

  for (const line of lines) {
    if (/^[^\s][^:]*:\s*$/.test(line)) {
      activeTopLevel = line.slice(0, -1).trim();
      currentPath = null;
      continue;
    }

    if (activeTopLevel === "info") {
      const match = line.match(/^  version:\s*(.+)$/);
      if (match) {
        version = normalizeYamlScalar(match[1]);
      }
    }

    if (activeTopLevel !== "paths") {
      continue;
    }

    const pathMatch = line.match(/^  (\/[^:]+):\s*$/);
    if (pathMatch) {
      currentPath = pathMatch[1];
      continue;
    }

    const methodMatch = line.match(/^    (get|post|put|patch|delete):\s*$/);
    if (methodMatch && currentPath) {
      operations.push({
        httpMethod: methodMatch[1].toUpperCase(),
        path: currentPath
      });
    }
  }

  if (!version) {
    throw new Error("Failed to parse the Email API version from docs/.openapi/email-api.yaml.");
  }

  return { operations, version };
};

const parseJsonOperations = (json) => {
  const spec = JSON.parse(json);
  const operations = [];

  for (const [pathName, pathDefinition] of Object.entries(spec.paths)) {
    for (const [httpMethod] of Object.entries(pathDefinition)) {
      operations.push({
        httpMethod: httpMethod.toUpperCase(),
        path: pathName
      });
    }
  }

  return {
    operations,
    version: spec.info.version
  };
};

const mapOperationsToFixture = (operations, methodMap, apiName) => {
  const missingOperations = [];
  const seenKeys = new Set();

  const endpoints = operations.map(({ httpMethod, path: endpointPath }) => {
    const key = `${httpMethod} ${endpointPath}`;
    const mapping = methodMap[key];
    if (!mapping) {
      missingOperations.push(key);
      return null;
    }

    seenKeys.add(key);
    return {
      ...mapping,
      httpMethod,
      path: endpointPath
    };
  }).filter(endpoint => endpoint !== null);

  const staleMappings = Object.keys(methodMap).filter(key => !seenKeys.has(key));
  if (staleMappings.length) {
    throw new Error(`Stale ${apiName} SDK method mapping entries:\n${staleMappings.join("\n")}`);
  }

  if (missingOperations.length) {
    console.warn(`Unmapped ${apiName} endpoints:\n${missingOperations.join("\n")}`);
  }

  return {
    endpoints,
    unmapped: missingOperations.map((operation) => {
      const [httpMethod, ...pathParts] = operation.split(" ");
      return {
        httpMethod,
        path: pathParts.join(" ")
      };
    })
  };
};

const writeJson = async (filePath, value) => {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
};

if (refreshSpecs) {
  const [emailSpec, inboundSpec] = await Promise.all([
    fetchText(EMAIL_SPEC_URL),
    fetchText(INBOUND_SPEC_URL)
  ]);

  await Promise.all([
    writeFile(emailSpecPath, emailSpec),
    writeFile(inboundSpecPath, inboundSpec)
  ]);
}

const [emailSpecText, inboundSpecText] = await Promise.all([
  readFile(emailSpecPath, "utf8"),
  readFile(inboundSpecPath, "utf8")
]);

const emailSpec = parseYamlOperations(emailSpecText);
const inboundSpec = parseJsonOperations(inboundSpecText);

const emailFixture = mapOperationsToFixture(emailSpec.operations, emailMethodMap, "Email API");
const inboundFixture = mapOperationsToFixture(inboundSpec.operations, inboundMethodMap, "Inbound API");

await Promise.all([
  writeJson(emailFixturePath, {
    version: emailSpec.version,
    endpoints: emailFixture.endpoints,
    unmapped: emailFixture.unmapped
  }),
  writeJson(inboundFixturePath, {
    version: inboundSpec.version,
    endpoints: inboundFixture.endpoints,
    unmapped: inboundFixture.unmapped
  })
]);

console.info(`Wrote ${path.relative(rootDir, emailFixturePath)}`);
console.info(`Wrote ${path.relative(rootDir, inboundFixturePath)}`);
