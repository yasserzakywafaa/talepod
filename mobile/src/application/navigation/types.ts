import type { CompositeNavigationProp } from "@react-navigation/native";
import type { NavigatorScreenParams } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  mobileRoutes,
  rootRoutes,
  type RootSheetRouteName,
} from "src/application/routes";

import type { MainDrawerParamList } from "./MainDrawerNavigator";
import type { DashboardDrawerParamList } from "./DashboardDrawerNavigator";

export type RootStackParamList = {
  [rootRoutes.main]: NavigatorScreenParams<MainDrawerParamList>;
  [rootRoutes.dashboard]: NavigatorScreenParams<DashboardDrawerParamList>;
  [mobileRoutes.authenticated.viewStory]: { slug: string };
} & Record<RootSheetRouteName, undefined>;

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export type MainDrawerNavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<MainDrawerParamList>,
  RootStackNavigationProp
>;

/** @deprecated Use MainDrawerNavigationProp */
export type MarketingDrawerNavigationProp = MainDrawerNavigationProp;

export type DashboardDrawerNavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<DashboardDrawerParamList>,
  RootStackNavigationProp
>;
