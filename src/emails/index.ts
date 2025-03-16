import type { MailChannels } from "../mailchannels";
import checkDomain from "./check-domain";
import send from "./send";

export function defineEmails (mailchannels: MailChannels) {
  return {
    send: send(mailchannels),
    checkDomain: checkDomain(mailchannels)
  };
}
