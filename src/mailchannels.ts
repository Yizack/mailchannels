import { MailChannelsClient } from "./client";
import { Send, CheckDomain, Webhooks } from "./modules/emails";
import { createInstances, extractMethods } from "./utils/core";

export { MailChannelsClient };
export type * from "./types/emails";

const createEmailAPI = (mailchannels: MailChannels) => {
  const instances = createInstances(mailchannels, [
    Send,
    CheckDomain,
    Webhooks
  ]);
  const methods = extractMethods(instances);
  return methods;
};


export class MailChannels extends MailChannelsClient {
  readonly emails = createEmailAPI(this);

  constructor (key: string) {
    super(key);
  }
}
