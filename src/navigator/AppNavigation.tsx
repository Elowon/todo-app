import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TodoScreen from "../screens/TodoScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Todo"
        component={TodoScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
