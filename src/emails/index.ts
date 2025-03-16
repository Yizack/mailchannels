import type { MailChannels } from "../mailchannels";
import { send } from "./send";
import { checkDomain } from "./check-domain";
import { applyMailChannels } from "../utils/core";


export const defineEmails = (mailchannels: MailChannels) => applyMailChannels(mailchannels, {
  send,
  checkDomain
});
