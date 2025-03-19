export const mcError = (message: string): Error => {
  const error = new Error(message);
  error.name = "MailChannelsError";
  if (Error.captureStackTrace) Error.captureStackTrace(error, mcError);
  return error;
};
