import { describe, it, expect } from "vitest";
import { parseRecipient, parseArrayRecipients } from "../src/utils/recipients";


const fake = {
  pair: "Example <name@example.com>",
  object: { name: "Example", email: "name@example.com" }
};

describe("parseRecipient", () => {
  it("should parse recipient  name-address pairs", () => {
    const recipient = parseRecipient(fake.pair);
    expect(recipient).toEqual(fake.object);
  });

  it("should return exact recipient object", () => {
    const recipient = parseRecipient(fake.object);
    expect(recipient).toEqual(fake.object);
  });

});

describe("parseArrayRecipients", () => {
  it("should parse single recipient object to array", () => {
    const recipient = parseArrayRecipients(fake.object);
    expect(recipient).toEqual([fake.object]);
  });

  it("should parse array of recipients", () => {
    const recipient = parseArrayRecipients([fake.pair, fake.pair]);
    expect(recipient).toEqual([fake.object, fake.object]);
  });
});
