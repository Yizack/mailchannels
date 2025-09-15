import type { MetricsBucket } from ".";

export interface MetricsRecipientBehaviour {
  buckets: {
    unsubscribeDelivered: MetricsBucket[];
    unsubscribed: MetricsBucket[];
  };
  /**
   * The end of the time range for retrieving recipient behaviour metrics (exclusive).
   */
  endTime: string;
  /**
   * The beginning of the time range for retrieving recipient behaviour metrics (inclusive).
   */
  startTime: string;
  /**
   * Count of recipients of delivered messages that include at least one of the unsubscribe link or unsubscribe headers. Since the unsubscribe feature requires exactly one recipient per message, this count also represents the total number of delivered messages.
   */
  unsubscribeDelivered: number;
  /**
   * Count of unsubscribed events by recipients.
   */
  unsubscribed: number;
}

export interface MetricsRecipientBehaviourResponse {
  behaviour: MetricsRecipientBehaviour | null;
  error: string | null;
}
