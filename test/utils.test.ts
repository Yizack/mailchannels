import { describe, expect, it } from "vitest";
import type { FetchResponse } from "ofetch";
import { parseArrayRecipients, parseRecipient } from "../src/utils/recipients";
import { getStatusError } from "../src/utils/errors";
import { clean } from "../src/utils/helpers";

const fake = {
  pair: "Example <name@example.com>",
  object: { name: "Example", email: "name@example.com" }
};

describe("parseRecipient", () => {
  it("should parse recipient name-address pairs", () => {
    const recipient = parseRecipient(fake.pair);
    expect(recipient).toStrictEqual(fake.object);
  });

  it("should return exact recipient object", () => {
    const recipient = parseRecipient(fake.object);
    expect(recipient).toStrictEqual(fake.object);
  });

  it("should parse email without name", () => {
    const recipient = parseRecipient("name@example.com");
    expect(recipient).toStrictEqual({ email: "name@example.com" });
  });
});

describe("parseArrayRecipients", () => {
  it("should parse single recipient object to array", () => {
    const recipient = parseArrayRecipients(fake.object);
    expect(recipient).toStrictEqual([fake.object]);
  });

  it("should parse array of recipients", () => {
    const recipient = parseArrayRecipients([fake.pair, fake.pair]);
    expect(recipient).toStrictEqual([fake.object, fake.object]);
  });
});

describe("getStatusError", () => {
  type ErrorResponse = FetchResponse<{ message?: string, errors?: string[] } | string>;
  it("should return default error message", () => {
    const response = { status: 500 };
    const error = getStatusError(response as ErrorResponse);

    expect(error).toStrictEqual("Unknown error.");
  });

  it("should return custom error message", () => {
    const response = { status: 404 };
    const error = getStatusError(response as ErrorResponse, {
      404: "Custom not found error."
    });

    expect(error).toStrictEqual("Custom not found error.");
  });

  it("should return error message from response string", () => {
    const response = { _data: "Server is down" };
    const error = getStatusError(response as ErrorResponse);

    expect(error).toStrictEqual("Unknown error. Server is down");
  });

  it("should return error message from response object", () => {
    const response = { _data: { message: "Invalid request" } };
    const error = getStatusError(response as ErrorResponse);

    expect(error).toStrictEqual("Unknown error. Invalid request");
  });

  it("should return error message from response array", () => {
    const response = { _data: { errors: ["Invalid email", "Name is required"] } };
    const error = getStatusError(response as ErrorResponse);
    expect(error).toStrictEqual("Unknown error. Invalid email, Name is required");
  });
});

describe("clean", () => {
  it("should remove undefined values from object", () => {
    const input = {
      a: "Example",
      b: null,
      c: undefined,
      d: true,
      e: 0
    };
    const output = {
      a: "Example",
      b: null,
      d: true,
      e: 0
    };

    expect(clean(input)).toStrictEqual(output);
  });

  it("should remove undefined values from array", () => {
    const input = [
      "value1",
      null,
      "value2",
      undefined,
      "value3"
    ];
    const output = [
      "value1",
      null,
      "value2",
      "value3"
    ];

    expect(clean(input)).toStrictEqual(output);
  });
});
