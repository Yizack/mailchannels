import { MailChannelsClient } from "./client";
import { Emails, Service, SubAccounts, Webhooks } from "./modules";

export { MailChannelsClient };
export type * from "./types";

export class MailChannels extends MailChannelsClient {
  readonly emails = new Emails(this);
  readonly webhooks = new Webhooks(this);
  readonly subAccounts = new SubAccounts(this);
  readonly service = new Service(this);

  constructor (key: string) {
    super(key);
  }
}
