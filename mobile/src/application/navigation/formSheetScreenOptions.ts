import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Platform } from "react-native";

const ANDROID_SHEET_HEIGHT = 0.95;

export const formSheetScreenOptions = {
  presentation: "formSheet" as const,
  gestureEnabled: true,
  sheetGrabberVisible: true,
  sheetExpandsWhenScrolledToEdge: false,
  ...(Platform.OS === "android" && {
    sheetAllowedDetents: [ANDROID_SHEET_HEIGHT],
    sheetInitialDetentIndex: 0,
    sheetCornerRadius: 16,
  }),
} satisfies NativeStackNavigationOptions;
