import { sendGAEvent } from "@next/third-parties/google";

export type AnalyticsEvent =
  | "sign_up"
  | "game_import_complete"
  | "tracker_add"
  | "practice_start"
  | "practice_complete"
  | "volt_tracker_favorite_puzzle_clicked";

type EventParams = Record<string, string | number | boolean>;

export function trackEvent(event: AnalyticsEvent, params: EventParams = {}) {
  // Sunucudan ve geliştirme ortamından event gönderme.
  if (typeof window === "undefined" || process.env.NODE_ENV !== "production") {
    return;
  }

  sendGAEvent("event", event, params);
}
