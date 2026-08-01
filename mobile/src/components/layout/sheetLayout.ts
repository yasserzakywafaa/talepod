import { useReadableLayout } from "src/components/layout/useReadableLayout";

/** Shared spacing for root-stack form sheets (login, register, settings, account). */
export const SHEET_LAYOUT = {
  /** Space between the system grabber and sheet content (matches legacy AuthScreenBody). */
  paddingTopBelowGrabber: 32,
  contentGap: 6,
} as const;

export const useSheetContentStyle = () => {
  const { horizontalGutter, contentMaxWidth } = useReadableLayout();

  return {
    paddingTop: SHEET_LAYOUT.paddingTopBelowGrabber,
    paddingBottom: horizontalGutter,
    paddingHorizontal: horizontalGutter,
    gap: SHEET_LAYOUT.contentGap,
    width: "100%" as const,
    maxWidth: contentMaxWidth,
    alignSelf: "center" as const,
  };
};
