import { describe, expect, it } from "vitest";
import type { FetchResponse } from "ofetch";
import { parseArrayRecipients, parseRecipient } from "../src/utils/recipients";
import { getStatusError } from "../src/utils/errors";

const fake = {
  pair: "Example <name@example.com>",
  object: { name: "Example", email: "name@example.com" }
};

describe("parseRecipient", () => {
  it("should parse recipient name-address pairs", () => {
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

describe("getStatusError", () => {
  type ErrorResponse = FetchResponse<{ message?: string, errors?: string[] } | string>;
  it("should return default error message", () => {
    const response = { status: 500 };
    const error = getStatusError(response as ErrorResponse);

    expect(error).toEqual("Unknown error.");
  });

  it("should return custom error message", () => {
    const response = { status: 404 };
    const error = getStatusError(response as ErrorResponse, {
      404: "Custom not found error."
    });

    expect(error).toEqual("Custom not found error.");
  });

  it("should return error message from response string", () => {
    const response = { _data: "Server is down" };
    const error = getStatusError(response as ErrorResponse);

    expect(error).toEqual("Unknown error. Server is down");
  });

  it("should return error message from response object", () => {
    const response = { _data: { message: "Invalid request" } };
    const error = getStatusError(response as ErrorResponse);

    expect(error).toEqual("Unknown error. Invalid request");
  });

  it("should return error message from response array", () => {
    const response = { _data: { errors: ["Invalid email", "Name is required"] } };
    const error = getStatusError(response as ErrorResponse);
    expect(error).toEqual("Unknown error. Invalid email, Name is required");
  });
});
