import type { EmailsSendRecipient } from "../types/emails/send";

/**
 * Validates if a string is a valid email address
 */
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Parses name-address pair string to MailChannels format
 */
export const parseRecipientString = (input: string): EmailsSendRecipient | undefined => {
  const trimmed = input.trim();
  const match = trimmed.match(/^([^<]*)<([^>]*)>$/);

  if (match) {
    const [, name, email] = match;
    if (!email?.trim() || !isValidEmail(email.trim())) return undefined;

    return { email: email.trim(), name: name?.trim() };
  }

  if (!isValidEmail(trimmed)) return undefined;

  return { email: trimmed };
};

/**
 * Parses any recipient format to MailChannels format
 */
export const parseRecipient = (recipient?: EmailsSendRecipient | string) => {
  if (typeof recipient === "string") {
    return parseRecipientString(recipient);
  }

  if (!recipient?.email || !isValidEmail(recipient.email)) return undefined;

  return { email: recipient.email, name: recipient.name };
};

/**
 * Parses any array of recipients format to MailChannels format
 */
export const parseArrayRecipients = (recipients?: EmailsSendRecipient | EmailsSendRecipient[] | string[] | string) => {
  if (!recipients) return undefined;

  const arr = typeof recipients === "string" ? (
    [parseRecipientString(recipients)]
  ) : Array.isArray(recipients) ? (
    recipients.map(parseRecipient)
  ) : [recipients];

  const filtered = arr.filter((recipient): recipient is NonNullable<typeof recipient> => Boolean(recipient));

  return filtered.length > 0 ? filtered : undefined;
};
