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

const getPublicApiMethods = (value: object, excludedMethods: string[] = []) => {
  const excluded = new Set(["constructor", ...excludedMethods]);
  return Object.getOwnPropertyNames(Object.getPrototypeOf(value))
    .filter(name => !excluded.has(name) && !name.startsWith("_"))
    .sort();
};

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
  emails: getPublicApiMethods(mailchannels.emails),
  webhooks: getPublicApiMethods(mailchannels.webhooks, ["verify"]),
  subAccounts: getPublicApiMethods(mailchannels.subAccounts),
  metrics: getPublicApiMethods(mailchannels.metrics),
  suppressions: getPublicApiMethods(mailchannels.suppressions)
} satisfies Record<EmailApiModuleName, string[]>);

assertParityFixture("Inbound API", inboundParityFixture, {
  domains: getPublicApiMethods(mailchannels.domains),
  lists: getPublicApiMethods(mailchannels.lists),
  users: getPublicApiMethods(mailchannels.users),
  service: getPublicApiMethods(mailchannels.service)
} satisfies Record<InboundApiModuleName, string[]>);
