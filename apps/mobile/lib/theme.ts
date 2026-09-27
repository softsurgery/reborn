import { DarkTheme, DefaultTheme, Theme } from "expo-router";

export const THEME = {
  light: {
    background: "hsl(24 33.3333% 97.0588%)",
    foreground: "hsl(0 0% 10.1961%)",
    card: "hsl(192 15% 94%)",
    cardForeground: "hsl(0 0% 20%)",
    popover: "hsl(24 33.3333% 97.0588%)",
    popoverForeground: "hsl(0 0% 10.1961%)",
    primary: "hsl(24.1237 100% 61.9608%)",
    primaryForeground: "hsl(24 33.3333% 97.0588%)",
    secondary: "hsl(28.9091 98.2143% 78.0392%)",
    secondaryForeground: "hsl(35.5556 48.2143% 21.9608%)",
    muted: "hsl(22.5 21.0526% 92.549%)",
    mutedForeground: "hsl(33.3333 5.4545% 32.3529%)",
    accent: "hsl(48 96.4912% 88.8235%)",
    accentForeground: "hsl(0 62.8205% 30.5882%)",
    destructive: "hsl(0 70% 35.2941%)",
    destructiveForeground: "hsl(0 0% 100%)",
    border: "hsl(37.7143 63.6364% 89.2157%)",
    input: "hsl(37.7143 63.6364% 89.2157%)",
    ring: "hsl(0 55.7789% 39.0196%)",
    chart1: "hsl(0 73.7089% 41.7647%)",
    chart2: "hsl(0 55.7789% 39.0196%)",
    chart3: "hsl(0 62.8205% 30.5882%)",
    chart4: "hsl(25.9649 90.4762% 37.0588%)",
    chart5: "hsl(22.7273 82.5% 31.3725%)",
    sidebar: "hsl(22.5 21.0526% 92.549%)",
    sidebarForeground: "hsl(0 0% 10.1961%)",
    sidebarPrimary: "hsl(0 55.7789% 39.0196%)",
    sidebarPrimaryForeground: "hsl(0 0% 100%)",
    sidebarAccent: "hsl(48 96.4912% 88.8235%)",
    sidebarAccentForeground: "hsl(0 62.8205% 30.5882%)",
    sidebarBorder: "hsl(37.7143 63.6364% 89.2157%)",
    sidebarRing: "hsl(0 55.7789% 39.0196%)",
  },

  dark: {
    background: "hsl(24 9.8039% 10%)",
    foreground: "hsl(60 4.7619% 95.8824%)",
    card: "hsl(0 0% 14.902%)",
    cardForeground: "hsl(0 0% 89.8039%)",
    popover: "hsl(12 6.4935% 15.098%)",
    popoverForeground: "hsl(60 4.7619% 95.8824%)",
    primary: "hsl(24.1237 100% 61.9608%)",
    primaryForeground: "hsl(24 33.3333% 97.0588%)",
    secondary: "hsl(28.9091 98.2143% 78.0392%)",
    secondaryForeground: "hsl(35.5556 48.2143% 21.9608%)",
    muted: "hsl(24 8.7719% 11.1765%)",
    mutedForeground: "hsl(24 5.7471% 82.9412%)",
    accent: "hsl(25.9649 90.4762% 37.0588%)",
    accentForeground: "hsl(48 96.4912% 88.8235%)",
    destructive: "hsl(0 84.2365% 60.1961%)",
    destructiveForeground: "hsl(0 0% 100%)",
    border: "hsl(30 6.25% 25.098%)",
    input: "hsl(30 6.25% 25.098%)",
    ring: "hsl(0 73.7089% 41.7647%)",
    chart1: "hsl(0 90.604% 70.7843%)",
    chart2: "hsl(0 84.2365% 60.1961%)",
    chart3: "hsl(0 72.2222% 50.5882%)",
    chart4: "hsl(43.2558 96.4126% 56.2745%)",
    chart5: "hsl(37.6923 92.126% 50.1961%)",
    sidebar: "hsl(24 9.8039% 10%)",
    sidebarForeground: "hsl(60 4.7619% 95.8824%)",
    sidebarPrimary: "hsl(0 73.7089% 41.7647%)",
    sidebarPrimaryForeground: "hsl(24 33.3333% 97.0588%)",
    sidebarAccent: "hsl(25.9649 90.4762% 37.0588%)",
    sidebarAccentForeground: "hsl(48 96.4912% 88.8235%)",
    sidebarBorder: "hsl(30 6.25% 25.098%)",
    sidebarRing: "hsl(0 73.7089% 41.7647%)",
  },
} as const;

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
  const match = hslString.match(/hsl\(([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\)/);
  if (!match) return hslString; // Return as-is if not valid HSL
  let h = parseFloat(match[1]) / 360;
  let s = parseFloat(match[2]) / 100;
  let l = parseFloat(match[3]) / 100;
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
