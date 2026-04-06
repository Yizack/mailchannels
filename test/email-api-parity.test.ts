import { describe, expect, it } from "vitest";
import { MailChannels } from "../src/mailchannels";
import emailParityFixture from "./fixtures/email-api-endpoints.json";
import inboundParityFixture from "./fixtures/inbound-api-endpoints.json";

type EmailApiModuleName = keyof Pick<MailChannels, "emails" | "webhooks" | "subAccounts" | "metrics" | "suppressions">;
type InboundApiModuleName = keyof Pick<MailChannels, "domains" | "lists" | "users" | "service">;

type ParityFixture = {
  version: string;
  endpoints: Array<{
    module: string;
    method: string;
    httpMethod: string;
    path: string;
  }>;
  unmapped?: Array<{
    httpMethod: string;
    path: string;
  }>;
};

const mailchannels = new MailChannels("test-api-key");

const assertParityFixture = (
  fixtureName: string,
  fixture: ParityFixture,
  actualByModule: Record<string, string[]>
) => {
  describe(`${fixtureName} parity fixture`, () => {
    it("should expose all documented API methods from the parity fixture", () => {
      for (const entry of fixture.endpoints) {
        const methods = actualByModule[entry.module];
        expect(methods, `Missing module ${entry.module}`).toBeDefined();
        expect(methods?.includes(entry.method), `Missing method ${entry.module}.${entry.method} for ${entry.httpMethod} ${entry.path}`).toBe(true);
      }
    });

    it("should keep the fixture in sync with the public module surfaces", () => {
      const fixtureByModule = fixture.endpoints.reduce<Record<string, string[]>>((acc, entry) => {
        acc[entry.module] ??= [];
        acc[entry.module]?.push(entry.method);
        return acc;
      }, {});

      for (const [module, methods] of Object.entries(actualByModule)) {
        expect(fixtureByModule[module]?.sort(), `Fixture mismatch for module ${module}`).toEqual(methods);
      }
    });

    it("should preserve the documented unmapped endpoint list", () => {
      expect(fixture.unmapped ?? []).toMatchSnapshot();
    });
  });
};

assertParityFixture("Email API", emailParityFixture, {
  emails: Object.getOwnPropertyNames(Object.getPrototypeOf(mailchannels.emails)).filter(name => name !== "constructor").sort(),
  webhooks: Object.getOwnPropertyNames(Object.getPrototypeOf(mailchannels.webhooks)).filter(name => name !== "constructor").sort(),
  subAccounts: Object.getOwnPropertyNames(Object.getPrototypeOf(mailchannels.subAccounts)).filter(name => name !== "constructor").sort(),
  metrics: Object.getOwnPropertyNames(Object.getPrototypeOf(mailchannels.metrics)).filter(name => name !== "constructor").sort(),
  suppressions: Object.getOwnPropertyNames(Object.getPrototypeOf(mailchannels.suppressions)).filter(name => name !== "constructor").sort()
} satisfies Record<EmailApiModuleName, string[]>);

assertParityFixture("Inbound API", inboundParityFixture, {
  domains: Object.getOwnPropertyNames(Object.getPrototypeOf(mailchannels.domains)).filter(name => name !== "constructor").sort(),
  lists: Object.getOwnPropertyNames(Object.getPrototypeOf(mailchannels.lists)).filter(name => name !== "constructor").sort(),
  users: Object.getOwnPropertyNames(Object.getPrototypeOf(mailchannels.users)).filter(name => name !== "constructor").sort(),
  service: Object.getOwnPropertyNames(Object.getPrototypeOf(mailchannels.service)).filter(name => name !== "constructor").sort()
} satisfies Record<InboundApiModuleName, string[]>);
