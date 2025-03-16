import type { MailChannels } from "../mailchannels";
import type { EmailsCheckDomainOptions, EmailsCheckDomainResponse } from "../types/emails";

export default (mailchannels: MailChannels) => {
  /**
   * Validates a domain's email authentication setup by retrieving its DKIM, SPF, and Domain Lockdown status. This endpoint checks whether the domain is properly configured for secure email delivery.
   * @param options - The domain options to check
   * @example
   * ```ts
   * const mailchannels = new MailChannels("your-api-key");
   * const { success } = await mailchannels.emails.checkDomain({
   *   dkim: {
   *     domain: "example.com",
   *     privateKey
   *     selector: "mailchannels"
   *   },
   *   domain: "example.com",
   *   senderId: "sender-id"
   * })
   * ```
   */
  return async (options: EmailsCheckDomainOptions) => {
    const { dkim, domain, senderId } = options;
    return mailchannels.post<EmailsCheckDomainResponse>("/tx/v1/check-domain", {
      body: {
        dkim_settings: [{
          dkim_domain: dkim.domain,
          dkim_private_key: dkim.privateKey,
          dkim_selector: dkim.selector
        }],
        domain,
        sender_id: senderId
      }
    });
  };
};
