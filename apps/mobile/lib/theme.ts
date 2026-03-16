import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";

export const THEME = {
  light: {
    background: "hsl(24 33.33% 97.06%)",
    foreground: "hsl(0 0% 10.2%)",
    card: "hsl(24 33.33% 97.06%)",
    cardForeground: "hsl(0 0% 10.2%)",
    popover: "hsl(24 33.33% 97.06%)",
    popoverForeground: "hsl(0 0% 10.2%)",
    primary: "hsl(0 55.78% 39.02%)",
    primaryForeground: "hsl(0 0% 100%)",
    secondary: "hsl(43.08 90.7% 91.57%)",
    secondaryForeground: "hsl(39.84 100% 25.1%)",
    muted: "hsl(22.5 21.05% 92.55%)",
    mutedForeground: "hsl(33.33 5.45% 32.35%)",
    accent: "hsl(48 96.49% 88.82%)",
    accentForeground: "hsl(0 62.82% 30.59%)",
    destructive: "hsl(0 70% 35.29%)",
    destructiveForeground: "hsl(0 0% 100%)",
    border: "hsl(37.71 63.64% 89.22%)",
    input: "hsl(37.71 63.64% 89.22%)",
    ring: "hsl(0 55.78% 39.02%)",
    chart1: "hsl(0 73.71% 41.76%)",
    chart2: "hsl(0 55.78% 39.02%)",
    chart3: "hsl(0 62.82% 30.59%)",
    chart4: "hsl(25.96 90.48% 37.06%)",
    chart5: "hsl(22.73 82.5% 31.37%)",
  },
  dark: {
    background: "hsl(24 9.8% 10%)",
    foreground: "hsl(60 4.76% 95.88%)",
    card: "hsl(12 6.49% 15.1%)",
    cardForeground: "hsl(60 4.76% 95.88%)",
    popover: "hsl(12 6.49% 15.1%)",
    popoverForeground: "hsl(60 4.76% 95.88%)",
    primary: "hsl(0 73.71% 41.76%)",
    primaryForeground: "hsl(24 33.33% 97.06%)",
    secondary: "hsl(22.73 82.5% 31.37%)",
    secondaryForeground: "hsl(48 96.49% 88.82%)",
    muted: "hsl(12 6.49% 15.1%)",
    mutedForeground: "hsl(24 5.75% 82.94%)",
    accent: "hsl(25.96 90.48% 37.06%)",
    accentForeground: "hsl(48 96.49% 88.82%)",
    destructive: "hsl(0 84.24% 60.2%)",
    destructiveForeground: "hsl(0 0% 100%)",
    border: "hsl(30 6.25% 25.1%)",
    input: "hsl(30 6.25% 25.1%)",
    ring: "hsl(0 73.71% 41.76%)",
    chart1: "hsl(0 90.6% 70.78%)",
    chart2: "hsl(0 84.24% 60.2%)",
    chart3: "hsl(0 72.22% 50.59%)",
    chart4: "hsl(43.26 96.41% 56.27%)",
    chart5: "hsl(37.69 92.13% 50.2%)",
  },
};

export const NAV_THEME: Record<"light" | "dark", Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};

export function hslToHex(hslString: string): string {
  const match = hslString.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
  if (!match) return hslString; // Return as-is if not valid HSL
  let h = parseInt(match[1], 10) / 360;
  let s = parseInt(match[2], 10) / 100;
  let l = parseInt(match[3], 10) / 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
