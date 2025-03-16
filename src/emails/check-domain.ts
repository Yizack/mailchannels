import type { MailChannels } from "../mailchannels";
import type { EmailsCheckDomainOptions, EmailsCheckDomainResponse } from "../types/emails";

export const checkDomain = (mailchannels: MailChannels) => {
  /**
   * Validates a domain's email authentication setup by retrieving its DKIM, SPF, and Domain Lockdown status. This endpoint checks whether the domain is properly configured for secure email delivery.
   * @param options - The domain options to check
   * @example
   * ```ts
   * const mailchannels = new MailChannels("your-api-key");
   * const { results } = await mailchannels.emails.checkDomain({
   *   dkim: [{
   *     domain: "example.com",
   *     privateKey
   *     selector: "mailchannels"
   *   }],
   *   domain: "example.com",
   *   senderId: "sender-id"
   * })
   * ```
   */
  return async (options: EmailsCheckDomainOptions) => {
    const { dkim, domain, senderId } = options;
    const dkimOptions = Array.isArray(dkim) ? dkim : [dkim];

    const payload = {
      dkim_settings: dkimOptions.map(({ domain, privateKey, selector }) => ({
        dkim_domain: domain,
        dkim_private_key: privateKey,
        dkim_selector: selector
      })),
      domain,
      sender_id: senderId
    };

    const check = await mailchannels.post<EmailsCheckDomainResponse>("/tx/v1/check-domain", {
      body: payload
    });

    return {
      results: {
        spf: check.check_results.spf,
        domainLockdown: check.check_results.domain_lockdown,
        dkim: check.check_results.dkim.map(({ dkim_domain, dkim_selector, verdict }) => ({
          dkimDomain: dkim_domain,
          dkimSelector: dkim_selector,
          verdict
        }))
      },
      payload
    };
  };
};
