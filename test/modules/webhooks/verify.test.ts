import { describe, expect, it, vi } from "vitest";
import { $fetch } from "ofetch";
import { generateKeyPairSync, subtle } from "node:crypto";
import { Buffer } from "node:buffer";
import type { MailChannelsClient } from "~/client";
import { Webhooks } from "~/modules/webhooks";
import { stripPemHeaders } from "~/utils/helpers";
import { DEFAULT_TOLERANCE, ED25519, HMAC_SHA256, encoder } from "~/utils/webhooks-validator";

const generateTestingKeys = () => {
  const ed25519Keys = generateKeyPairSync("ed25519", {
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" }
  });

  return { ed25519Keys };
};

const body = [{ test: "testBody" }];
const rawBody = JSON.stringify(body);
const { ed25519Keys } = generateTestingKeys();
const privateKeyBuffer = Buffer.from(stripPemHeaders(ed25519Keys.privateKey), "base64");
const privateKey = await subtle.importKey("pkcs8", privateKeyBuffer, ED25519, false, ["sign"]);

const timestamp = Math.floor(Date.now() / 1000);
const bodyBuffer = await subtle.digest(HMAC_SHA256.hash, Buffer.from(rawBody));
const bodyHash = Buffer.from(bodyBuffer).toString("base64");
const contentDigest = `sha-256=:${bodyHash}:`;

const signatureInputValues = `("content-digest");created=${timestamp};alg="ed25519";keyid="mckey"`;
const signatureInput = `sig_123456=${signatureInputValues}`;
const signingString = `"content-digest": ${contentDigest}
"@signature-params": ${signatureInputValues}`;

const signatureBuffer = await subtle.sign(ED25519.name, privateKey, encoder.encode(signingString));
const signature = `sig_123456=:${Buffer.from(signatureBuffer).toString("base64")}:`;

const fake = {
  options: {
    payload: rawBody,
    headers: {
      "content-digest": contentDigest,
      "signature": signature,
      "signature-input": signatureInput
    },
    publicKey: ed25519Keys.publicKey
  }
};

vi.mock("ofetch", () => ({
  $fetch: vi.fn()
}));

describe("verify", () => {
  it("should return true for valid webhook request", async () => {
    const mockClient = {} as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const isValidFromClient = await webhooks.verify(fake.options);

    const isValidFromStatic = await Webhooks.verify(fake.options);

    expect(isValidFromStatic).toBe(true);
    expect(isValidFromClient).toBe(true);
  });

  it("should return false for invalid content digest", async () => {
    const isValid = await Webhooks.verify({
      ...fake.options,
      headers: {
        ...fake.options.headers,
        "content-digest": "invalid-content-digest"
      }
    });

    expect(isValid).toBe(false);
  });

  it("should return false for missing content digest hash", async () => {
    const isValid = await Webhooks.verify({
      ...fake.options,
      headers: {
        ...fake.options.headers,
        "content-digest": "sha-256=::"
      }
    });

    expect(isValid).toBe(false);
  });

  it("should return false for wrong content digest hash name", async () => {
    const isValid = await Webhooks.verify({
      ...fake.options,
      headers: {
        ...fake.options.headers,
        "content-digest": "sha-512=:hash:"
      }
    });

    expect(isValid).toBe(false);
  });

  it("should return false for invalid signature", async () => {
    const isValid = await Webhooks.verify({
      ...fake.options,
      headers: {
        ...fake.options.headers,
        signature: "invalid-signature"
      }
    });

    expect(isValid).toBe(false);
  });

  it("should return false for invalid signature input", async () => {
    const isValid = await Webhooks.verify({
      ...fake.options,
      headers: {
        ...fake.options.headers,
        "signature-input": "invalid-signature-input"
      }
    });

    expect(isValid).toBe(false);
  });

  it("should return false for expired timestamp", async () => {
    const pastTimestamp = timestamp - (DEFAULT_TOLERANCE + 1);
    const expiredSignatureInputValues = `("content-digest");created=${pastTimestamp};alg="ed25519";keyid="mckey"`;
    const expiredSignatureInput = `sig_123456=${expiredSignatureInputValues}`;
    const expiredSigningString = `"content-digest": ${contentDigest}
"@signature-params": ${expiredSignatureInputValues}`;
    const expiredSignatureBuffer = await subtle.sign(ED25519.name, privateKey, encoder.encode(expiredSigningString));
    const expiredSignature = `sig_123456=:${Buffer.from(expiredSignatureBuffer).toString("base64")}:`;

    const isValid = await Webhooks.verify({
      ...fake.options,
      headers: {
        ...fake.options.headers,
        "signature-input": expiredSignatureInput,
        "signature": expiredSignature
      }
    });

    expect(isValid).toBe(false);
  });

  it("should return true for valid webhook request with public key fetch", async () => {
    vi.mocked($fetch).mockResolvedValueOnce({
      id: "mckey",
      key: fake.options.publicKey
    });

    const isValid = await Webhooks.verify({
      ...fake.options,
      publicKey: undefined
    });

    expect(isValid).toBe(true);
  });

  it("should return false if public key fetch fails", async () => {
    vi.mocked($fetch).mockRejectedValueOnce(new Error("Failed to fetch public key"));

    const isValid = await Webhooks.verify({
      ...fake.options,
      publicKey: undefined
    });

    expect(isValid).toBe(false);
  });

  it("should return false on error throwing during verification", async () => {
    vi.spyOn(subtle, "verify").mockRejectedValueOnce(new Error("Verification error"));

    const isValid = await Webhooks.verify(fake.options);

    expect(isValid).toBe(false);
  });
});
