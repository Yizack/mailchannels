import { MailChannelsClient } from "./client";
import { Domains, Emails, Lists, Service, SubAccounts, Users, Webhooks } from "./modules";

export { MailChannelsClient };
export type * from "./types";

export class MailChannels extends MailChannelsClient {
  readonly emails = new Emails(this);
  readonly webhooks = new Webhooks(this);
  readonly subAccounts = new SubAccounts(this);
  readonly service = new Service(this);
  readonly domains = new Domains(this);
  readonly users = new Users(this);
  readonly lists = new Lists(this);

  constructor (key: string) {
    super(key);
  }
}
