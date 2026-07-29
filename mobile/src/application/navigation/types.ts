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
import type { MarketingDrawerParamList } from "./MarketingDrawerNavigator";

export type RootStackParamList = {
  [rootRoutes.marketing]: NavigatorScreenParams<MarketingDrawerParamList>;
  [rootRoutes.main]: NavigatorScreenParams<MainDrawerParamList>;
  [rootRoutes.dashboard]: NavigatorScreenParams<DashboardDrawerParamList>;
  [mobileRoutes.authenticated.viewStory]: { slug: string };
  [mobileRoutes.authenticated.myProfile]: undefined;
} & Record<RootSheetRouteName, undefined>;

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export type MarketingDrawerNavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<MarketingDrawerParamList>,
  RootStackNavigationProp
>;

export type DashboardDrawerNavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<DashboardDrawerParamList>,
  RootStackNavigationProp
>;
