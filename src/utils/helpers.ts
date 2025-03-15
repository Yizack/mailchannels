import type { MailChannelsEmailRecipient, MailChannelsEmailOptions } from "../types/emails";

/**
 * Parses name-address pair string to MailChannels format
 */
export const parseRecipientString = (input: string) => {
  const trimmed = input.trim();
  const match = trimmed.match(/^([^<]*)<([^@\s]+@[^>\s]+)>$/);
  if (match) {
    const [, name, email] = match;
    return { email: email?.trim() || "", name: name?.trim() };
  }
  return { email: trimmed };
};

/**
 * Parses any recipient format to MailChannels format
 */
export const parseRecipient = (recipient?: MailChannelsEmailRecipient | string) => {
  if (typeof recipient === "string") {
    return parseRecipientString(recipient);
  }

  return { email: "", ...recipient };
};

/**
 * Parses any array of recipients format to MailChannels format
 */
export const parseArrayRecipients = (recipients?: MailChannelsEmailRecipient | MailChannelsEmailRecipient[] | string[] | string) => {
  if (!recipients) return;

  if (typeof recipients === "string") {
    return [parseRecipientString(recipients)];
  }

  if (Array.isArray(recipients)) {
    return recipients.map(recipient => parseRecipient(recipient));
  }

  return [recipients];
};
