// const tintColorLight = "#0a7ea4";
// const tintColorDark = "#fff";
// const primary = "#f49b33";
// const secondary = "#2b2b2b";
// export const Colors = {
//   light: {
//     text: "#CF2526",
//     background: "#fff",
//     tint: tintColorLight,
//     icon: "#687076",
//     tabIconDefault: "#CF2526",
//     tabIconSelected: tintColorLight,
//   },
//   dark: {
//     text:"#CF2526" ,
//     background: "#151718",
//     tint: tintColorDark,
//     icon: "#9BA1A6",
//     tabIconDefault: "#CF2526",
//     tabIconSelected: tintColorDark,
//   },
//   PRIMARY: primary,
//   SECONDARY: secondary,
// };
const PRIMARY = "#CF2526";     // Main brand red
const SECONDARY = "#2b2b2b";   // Dark background
const LIGHT_BG = "#FFFFFF";
const DARK_BG = "#151718";

export const Colors = {
  light: {
    text: "#1C1C1C",          // better for readability than red text everywhere
    background: LIGHT_BG,
    primary: PRIMARY,
    secondary: SECONDARY,
    icon: "#687076",
    tabIconDefault: "#A0A0A0",
    tabIconSelected: PRIMARY,
    border: "#E5E7EB",
    mutedText: "#666666",
  },

  dark: {
    text: "#F5F5F5",
    background: DARK_BG,
    primary: PRIMARY,
    secondary: SECONDARY,
    icon: "#9BA1A6",
    tabIconDefault: "#A0A0A0",
    tabIconSelected: PRIMARY,
    border: "#2A2A2A",
    mutedText: "#A1A1A1",
  },

  PRIMARY,
  SECONDARY,
};
