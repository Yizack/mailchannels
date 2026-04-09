import { describe, expect, it } from "vitest";
import { camelCase } from "scule";
import { MailChannels, MailChannelsClient } from "../src/mailchannels";
import * as modules from "../src/modules";

const apiKey = "test-api-key";

describe("MailChannels", () => {
  it("should extend MailChannelsClient", () => {
    const mailChannels = new MailChannels(apiKey);
    expect(mailChannels).toBeInstanceOf(MailChannelsClient);
  });

  for (const [name, Module] of Object.entries(modules)) {
    it(`should initialize ${name} module`, () => {
      const mailChannels = new MailChannels(apiKey);
      const module = mailChannels[camelCase(name) as keyof InstanceType<typeof MailChannels>];
      expect(module).toBeInstanceOf(Module);
    });
  }

  it("should export MailChannelsClient", () => {
    expect(MailChannelsClient).toBeDefined();
  });
});
