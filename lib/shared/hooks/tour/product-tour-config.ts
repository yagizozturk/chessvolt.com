import type { Locale, PartialDeep, Props, Styles } from "react-joyride";

export const PRODUCT_TOUR_BUTTON_STYLES: PartialDeep<Styles> = {
  buttonPrimary: {
    border: "none",
    outline: "none",
    boxShadow: "none",
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: "var(--primary)",
    color: "var(--primary-foreground)",
  },
  buttonBack: {
    border: "none",
    outline: "none",
    borderRadius: 8,
    fontSize: 14,
    color: "var(--primary)",
  },
  buttonSkip: {
    border: "none",
    outline: "none",
    borderRadius: 8,
    fontSize: 14,
    color: "var(--primary)",
  },
};

export const PRODUCT_TOUR_LOCALE: Locale = {
  last: "Got it",
  skip: "Skip tour",
};

export const DEFAULT_PRODUCT_TOUR_JOYRIDE = {
  continuous: true,
  scrollToFirstStep: true,
  options: {
    showProgress: true,
    skipBeacon: true,
    primaryColor: "oklch(0.852 0.199 91.936)",
    overlayColor: "rgba(0, 0, 0, 0.8)",
  },
  locale: PRODUCT_TOUR_LOCALE,
  styles: PRODUCT_TOUR_BUTTON_STYLES,
} satisfies Omit<Props, "steps">;

export function getProductTourStorageKey(tourId: string) {
  return `product-tour-seen:${tourId}`;
}
