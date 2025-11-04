// src/styled.d.ts
import "styled-components/native";

declare module "styled-components/native" {
  export interface DefaultTheme {
    colors: {
      background: string;
      surface: string;
      primary: string;
      accent: string;
      text: string;
      muted: string;
      todoBg: string;
      shadow: string;
    };
    spacing: {
      px: number;
      sm: number;
      md: number;
      lg: number;
    };
  }
}
