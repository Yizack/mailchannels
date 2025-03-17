import type { MailChannels } from "../mailchannels";
import { createInstances, extractMethods } from "../utils/core";
import Send from "./send";
import CheckDomain from "./check-domain";
import Webhooks from "./webhooks";

export const createEmailAPI = (mailchannels: MailChannels) => {
  const instances = createInstances(mailchannels, [
    Send,
    CheckDomain,
    Webhooks
  ]);
  const methods = extractMethods(instances);
  return methods;
};
