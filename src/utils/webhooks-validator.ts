import { subtle } from "node:crypto";
import { Buffer } from "node:buffer";
import { stripPemHeaders } from "./helpers";
import type { WebhooksVerifyOptions } from "../types/webhooks/verify";
import { $fetch } from "ofetch";

export const HMAC_SHA256 = { name: "HMAC", hash: "SHA-256" };
export const ED25519 = { name: "Ed25519", namedCurve: "Ed25519" };
export const encoder = new TextEncoder();

export const DEFAULT_TOLERANCE = 300; // 5 minutes
const HEADER_CONTENT_DIGEST = "content-digest";
const HEADER_SIGNATURE = "signature";
const HEADER_SIGNATURE_INPUT = "signature-input";

const validateContentDigest = async (header: string, body: string) => {
  const match = header.match(/^(.*?)=:(.*?):$/);
  if (!match) return false;

  const [, algorithm, hash] = match;
  if (!algorithm || !hash) return false;

  const normalizedAlgorithm = algorithm.replace("-", "").toLowerCase();

  if (!["sha256"].includes(normalizedAlgorithm)) return false;

  const signatureBuffer = await subtle.digest(HMAC_SHA256.hash, encoder.encode(body));
  const computedHash = Buffer.from(signatureBuffer).toString("base64");
  return computedHash === hash;
};

const extractSignature = (signatureHeader: string): string | null => {
  const signatureMatch = signatureHeader.match(/sig_\d+=:([^:]+):/);
  return signatureMatch && signatureMatch[1] ? signatureMatch[1] : null;
};

const extractInputValues = (header: string) => {
  const regex = /^(\w+)=\(([^)]+)\);created=(\d+);alg="([^"]+)";keyid="([^"]+)"$/;
  const match = header.match(regex);

  if (!match) return null;

  return {
    name: match[1],
    timestamp: Number.parseInt(match[3]!, 10),
    algorithm: match[4],
    keyId: match[5]
  };
};

export async function isValidWebhook (options: WebhooksVerifyOptions) {
  const { payload, headers } = options;

  const contentDigest = headers[HEADER_CONTENT_DIGEST];
  const messageSignature = headers[HEADER_SIGNATURE];
  const signatureInput = headers[HEADER_SIGNATURE_INPUT];

  if ((!payload || !contentDigest || !messageSignature || !signatureInput)
  || !(await validateContentDigest(contentDigest, payload))
  ) return false;

  const signature = extractSignature(messageSignature);
  if (!signature) return false;

  const values = extractInputValues(signatureInput);
  if (!values) return false;

  const now = Math.floor(Date.now() / 1000);
  if (now - values.timestamp > DEFAULT_TOLERANCE) return false;

  const signingString = `"content-digest": ${contentDigest}
"@signature-params": ("content-digest");created=${values.timestamp};alg="${values.algorithm}";keyid="${values.keyId}"`;

  let publicKey = options.publicKey;
  if (!publicKey) {
    const publicKeyResponse = await $fetch<{ id: string, key: string }>("/tx/v1/webhook/public-key", {
      baseURL: "https://api.mailchannels.net",
      query: { id: values.keyId }
    }).catch(() => null);
    if (!publicKeyResponse) return false;
    publicKey = publicKeyResponse.key;
  }
  publicKey = stripPemHeaders(publicKey);

  const encoding = "base64";
  const format = "spki";

  const publicKeyBuffer = Buffer.from(publicKey, encoding);
  const webhookSignatureBuffer = Buffer.from(signature, encoding);

  const key = await subtle.importKey(format, publicKeyBuffer, ED25519, false, ["verify"]);
  return subtle.verify(ED25519.name, key, webhookSignatureBuffer, encoder.encode(signingString));
}
