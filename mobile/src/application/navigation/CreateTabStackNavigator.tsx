import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { mobileRoutes } from "src/application/routes";
import { CreateStoryScreen } from "src/screens/create/CreateStoryScreen";

export type CreateTabStackParamList = {
  [mobileRoutes.authenticated.create]: undefined;
};

const Stack = createNativeStackNavigator<CreateTabStackParamList>();

export const CreateTabStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={mobileRoutes.authenticated.create}>
        {(props) => (
          <CreateStoryScreen {...props} embeddedInMainShell />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
