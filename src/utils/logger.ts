export class Logger {
  private static name = "MailChannels";
  static error (message: string): void {
    console.error(`[${Logger.name}] [ERROR]: ${message}`);
  }
}
