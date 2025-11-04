// App.tsx
import React from "react";
import { CustomThemeProvider } from "./src/useTheme";
import TodoScreen from "./src/screens/TodoScreen";

export default function App() {
  return (
    <CustomThemeProvider>
      <TodoScreen />
    </CustomThemeProvider>
  );
}
