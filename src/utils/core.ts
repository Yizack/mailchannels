import type { MailChannels } from "../mailchannels";

export const applyMailChannels = <T extends Record<string, (mc: MailChannels) => unknown>>(
  mc: MailChannels,
  exports: T
) => Object.fromEntries(
  Object.entries(exports).map(([key, fn]) => [key, fn(mc)])
) as { [K in keyof T]: ReturnType<T[K]> };
