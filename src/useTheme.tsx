
import React, { createContext, useContext, useState, ReactNode } from "react";
import { ThemeProvider } from "styled-components/native";
import { lightTheme, darkTheme } from "./theme";

type ThemeName = "light" | "dark";

type ThemeContextType = {
  themeName: ThemeName;
  toggleTheme: () => void;
  setThemeName: (t: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  themeName: "light",
  toggleTheme: () => {},
  setThemeName: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);



export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>("light");

  const toggleTheme = () =>
    setThemeName((prev) => (prev === "light" ? "dark" : "light"));

  const currentTheme = themeName === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme, setThemeName }}>
      <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
