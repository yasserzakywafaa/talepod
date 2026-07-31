import type { CompositeNavigationProp } from "@react-navigation/native";
import type { NavigatorScreenParams } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { rootRoutes, type RootSheetRouteName } from "src/application/routes";

import type { MainDrawerParamList } from "./MainDrawerNavigator";
import type { DashboardDrawerParamList } from "./DashboardDrawerNavigator";

/**
 * The root stack holds only full-screen contexts and modal sheets. Everything
 * with app chrome — tabs, drawer, story reader — lives under `Main`.
 */
export type RootStackParamList = {
  [rootRoutes.main]: NavigatorScreenParams<MainDrawerParamList>;
  [rootRoutes.dashboard]: NavigatorScreenParams<DashboardDrawerParamList>;
} & Record<RootSheetRouteName, undefined>;

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export type MainDrawerNavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<MainDrawerParamList>,
  RootStackNavigationProp
>;
