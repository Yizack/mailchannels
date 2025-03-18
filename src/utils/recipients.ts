import type { EmailsSendRecipient } from "../types/emails/send";

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
export const parseRecipient = (recipient?: EmailsSendRecipient | string) => {
  if (typeof recipient === "string") {
    return parseRecipientString(recipient);
  }

  if (recipient?.email) {
    return { email: recipient.email, name: recipient.name };
  }
};

/**
 * Parses any array of recipients format to MailChannels format
 */
export const parseArrayRecipients = (recipients?: EmailsSendRecipient | EmailsSendRecipient[] | string[] | string) => {
  if (!recipients) return;

  if (typeof recipients === "string") {
    return [parseRecipientString(recipients)];
  }

  if (Array.isArray(recipients)) {
    return recipients
      .map((recipient) => parseRecipient(recipient))
      .filter((recipient): recipient is NonNullable<typeof recipient> => Boolean(recipient));
  }

  return [recipients];
};
