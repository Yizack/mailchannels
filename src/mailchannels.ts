import { MailChannelsClient } from "./client";
import { Domains, Emails, Lists, Metrics, Service, SubAccounts, Suppressions, Users, Webhooks } from "./modules";

export { MailChannelsClient };
export * from "./modules";
export type * from "./types";

export class MailChannels extends MailChannelsClient {
  // Modules: Email API
  readonly emails = new Emails(this);
  readonly webhooks = new Webhooks(this);
  readonly subAccounts = new SubAccounts(this);
  readonly metrics = new Metrics(this);
  readonly suppressions = new Suppressions(this);

  // Modules: Inbound API
  readonly domains = new Domains(this);
  readonly lists = new Lists(this);
  readonly users = new Users(this);
  readonly service = new Service(this);

  constructor (key: string) {
    super(key);
  }
}
