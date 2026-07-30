import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Platform } from "react-native";

const ANDROID_SHEET_HEIGHT = 0.9;
const IOS_SHEET_HEIGHT = 0.99;

export const formSheetScreenOptions = {
  presentation: "formSheet" as const,
  gestureEnabled: true,
  sheetGrabberVisible: true,
  sheetExpandsWhenScrolledToEdge: false,
  ...(Platform.OS === "ios" && {
    sheetAllowedDetents: [IOS_SHEET_HEIGHT],
  }),
  ...(Platform.OS === "android" && {
    sheetAllowedDetents: [ANDROID_SHEET_HEIGHT],
    sheetInitialDetentIndex: 0,
    sheetCornerRadius: 16,
  }),
} satisfies NativeStackNavigationOptions;
