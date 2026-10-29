import { sendGAEvent } from "@next/third-parties/google";

export type AnalyticsEvent =
  | "sign_up"
  | "game_import_complete"
  | "tracker_add"
  | "practice_start"
  | "practice_complete"
  | "volt_tracker_favorite_puzzle_clicked"
  | "puzzle_started"
  | "puzzle_completed"
  | "opening_game_selected"
  | "opening_game_completed"
  | "game_mode_switched"
  | "study_selected"
  | "game_analysis_searched"
  | "game_analysis_clicked"
  | "sign_up_completed"
  | "login_completed";

type EventParams = Record<string, string | number | boolean>;

export function trackEvent(event: AnalyticsEvent, params: EventParams = {}) {
  // Sunucudan ve geliştirme ortamından event gönderme.
  if (typeof window === "undefined" || process.env.NODE_ENV !== "production") {
    return;
  }

  sendGAEvent("event", event, params);
}
