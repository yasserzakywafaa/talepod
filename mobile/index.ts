import "react-native-gesture-handler";
import "react-native-reanimated";
import "expo-asset";

import { registerRootComponent } from "expo";

import { setupMobileAxios } from "./src/application/shared/apiClient";
import App from "./src/application/App";

setupMobileAxios();

registerRootComponent(App);
