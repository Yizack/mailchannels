import { describe, expect, it } from "vitest";
import { MailChannels } from "../src/mailchannels";
import parityFixture from "./fixtures/email-api-endpoints.json";

type ModuleName = keyof Pick<MailChannels, "emails" | "webhooks" | "subAccounts" | "metrics" | "suppressions">;

describe("Email API parity fixture", () => {
  const mailchannels = new MailChannels("test-api-key");

  it("should expose all documented Email API methods from the parity fixture", () => {
    for (const entry of parityFixture.endpoints) {
      const module = mailchannels[entry.module as ModuleName] as unknown as Record<string, unknown>;
      expect(module, `Missing module ${entry.module}`).toBeDefined();
      expect(typeof module[entry.method], `Missing method ${entry.module}.${entry.method} for ${entry.httpMethod} ${entry.path}`).toBe("function");
    }
  });

  it("should keep the fixture in sync with the public Email API module surfaces", () => {
    const fixtureByModule = parityFixture.endpoints.reduce<Record<string, string[]>>((acc, entry) => {
      acc[entry.module] ??= [];
      acc[entry.module]?.push(entry.method);
      return acc;
    }, {});

    const actualByModule: Record<string, string[]> = {
      emails: Object.getOwnPropertyNames(Object.getPrototypeOf(mailchannels.emails)).filter(name => name !== "constructor").sort(),
      webhooks: Object.getOwnPropertyNames(Object.getPrototypeOf(mailchannels.webhooks)).filter(name => name !== "constructor").sort(),
      subAccounts: Object.getOwnPropertyNames(Object.getPrototypeOf(mailchannels.subAccounts)).filter(name => name !== "constructor").sort(),
      metrics: Object.getOwnPropertyNames(Object.getPrototypeOf(mailchannels.metrics)).filter(name => name !== "constructor").sort(),
      suppressions: Object.getOwnPropertyNames(Object.getPrototypeOf(mailchannels.suppressions)).filter(name => name !== "constructor").sort()
    };

    for (const [module, methods] of Object.entries(actualByModule)) {
      expect(fixtureByModule[module]?.sort(), `Fixture mismatch for module ${module}`).toEqual(methods);
    }
  });
});
