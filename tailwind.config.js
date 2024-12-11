/** @type {import('tailwindcss').Config} */
import * as constants from "./src/utils/Constants";

module.exports = {
  content: [
    "./src/components/*.{html,js}",
    "./src/*.{html,js}",
    "./public/*.{html,js}",
  ],
  safelist: [
    "text-opacity-45 border-opacity-45 bg-opacity-35 hover:text-opacity-70 hover:border-opacity-60 hover:bg-opacity-60",
  ],
  theme: {
    screens: {
      tablet: "550px", // => @media (min-width: 550px) { ... }
      desktop: "1400px", // => @media (min-width: 1280px) { ... }
    },
    extend: {
      fontFamily: {
        heavitas: ["Heavitas", "sans-serif"],
      },
      maxHeight: {
        "[article-img]": `${constants.IMAGE_HEIGHT}px`,
      },
      width: {
        "[article-card]": `${constants.ARTICLE_WIDTH}px`,
        "[content-t]": "calc(100vw - 256px)",
        "[content-d]": "calc(100vw - 640px)",
      },
      minWidth: {
        "[article-card]": `${constants.ARTICLE_WIDTH}px`,
      },
      maxWidth: {
        "[content-t]": "calc(100vw - 256px)",
        "[content-d]": "calc(100vw - 640px)",
      },
      keyframes: {
        shimmer: {
          "0%": {
            backgroundPosition: "-100% 0",
          },
          "100%": {
            backgroundPosition: "100% 0",
          },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite linear",
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      const arrowButtons = {
        ".arrow-left": {
          position: "absolute",
          left: "0.25rem",
          top: constants.SCROLL_ARROWS_TOP_DEFAULT,
          color: "rgb(255 255 255 / var(--tw-text-opacity))",
          backgroundColor: "rgb(0 0 0 / var(--tw-bg-opacity))",
          borderColor: "rgb(255 255 255 / var(--tw-border-opacity))",
          borderWidth: `${constants.SCROLL_ARROWS_BORDER}px`,
          borderRadius: "9999px",
          "&:hover": {
            color: "rgb(229 231 235 / var(--tw-text-opacity))",
          },

          "@screen tablet": {
            top: constants.SCROLL_ARROWS_TOP_TABLET,
            left: "1.25rem",
          },
        },
        ".arrow-right": {
          position: "absolute",
          right: "0.25rem",
          top: constants.SCROLL_ARROWS_TOP_DEFAULT,
          color: "rgb(255 255 255 / var(--tw-text-opacity))",
          backgroundColor: "rgb(0 0 0 / var(--tw-bg-opacity))",
          borderColor: "rgb(255 255 255 / var(--tw-border-opacity))",
          borderWidth: `${constants.SCROLL_ARROWS_BORDER}px`,
          borderRadius: "9999px",
          "&:hover": {
            color: "rgb(229 231 235 / var(--tw-text-opacity))",
          },
          "@screen tablet": {
            top: constants.SCROLL_ARROWS_TOP_TABLET,
            right: "1.25rem",
          },
        },
      };

      addComponents(arrowButtons);
    },
    function ({ addComponents }) {
      const activeArticle = {
        "article.selected": {
          borderTop: "2px solid var(--accent-color)",
          borderRight: "2px solid var(--accent-color)",
          borderBottom: "0",
          borderLeft: "2px solid var(--accent-color)",
        },
        "article.selected div:has(h3)": {
          borderTop: "2px solid var(--accent-color)",
          backgroundColor: "var(--accent-color)",
          color: "var(--primary-color)",
        },
        "article.selected h3": {
          color: "var(--text-color)",
        },
        "@media (hover: hover)": {
          "article:hover:not(.selected)": {
            backgroundColor: "var(--accent-color)",
            borderTop: "2px solid var(--accent-color)",
            borderRight: "2px solid var(--accent-color)",
            borderBottom: "0",
            borderLeft: "2px solid var(--accent-color)",
          },
          "article:hover:not(.selected) div:has(h3)": {
            borderTop: "2px solid var(--accent-color)",
            borderBottom: "2px solid var(--accent-color)",
            backgroundColor: "var(--primary-color)",
          },
          "article:hover:not(.selected) h3": {
            color: "var(--text-color)",
          },
        },
      };

      addComponents(activeArticle);
    },
    function ({ addComponents }) {
      const hideScrollbar = {
        ".scrollbar-hide": {
          "-ms-overflow-style": "none" /* IE and Edge */,
          "scrollbar-width": "none" /* Firefox */,
          "&::-webkit-scrollbar": {
            /* Chrome, Safari and Opera */
            display: "none",
          },
        },
      };

      addComponents(hideScrollbar);
    },
    function ({ addComponents }) {
      const innerShadows = {
        ".inner-bottom-left": {
          boxShadow:
            "inset 0px -4px 3px -4px var(--text-color), inset 4px 0px 3px -4px var(--text-color)",
        },
        ".inner-bottom-right": {
          boxShadow:
            "inset 0px -4px 3px -4px var(--text-color), inset -4px 0px 3px -4px var(--text-color)",
        },
        ".inner-top-left": {
          boxShadow:
            "inset 0px 4px 3px -4px var(--text-color), inset 4px 0px 3px -4px var(--text-color)",
        },
        ".inner-top-right": {
          boxShadow:
            "inset 0px 4px 3px -4px var(--text-color), inset -4px 0px 3px -4px var(--text-color)",
        },
        ".inner-top": {
          boxShadow: "inset 0px 4px 3px -4px var(--text-color)",
        },
        ".inner-bottom": {
          boxShadow: "inset 0px -4px 3px -4px var(--text-color)",
        },
        ".inner-left": {
          boxShadow: "inset 4px 0px 3px -4px var(--text-color)",
        },
        ".inner-right": {
          boxShadow: "inset -4px 0px 3px -4px var(--text-color)",
        },
      };

      addComponents(innerShadows);
    },
    function ({ addComponents }) {
      const slowPulse = {
        ".animate-pulse.slow": {
          animationDuration: "3.5s",
        },
      };

      addComponents(slowPulse);
    },
    function ({ addComponents }) {
      const contentBorder = {
        ".border-content": {
          borderWidth: "1px",
          borderStyle: "solid",
          borderTop: "0",
          borderColor: "var(--text-color)",
        },
        ".tab-corners": {
          position: "relative",
          "&:before": {
            content: '""',
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "1px",
            height: "1px",
            backgroundColor: "var(--text-color)",
          },
          "&:after": {
            content: '""',
            position: "absolute",
            bottom: "0",
            right: "-1px",
            width: "1px",
            height: "1px",
            backgroundColor: "var(--text-color)",
          },
        },
      };

      addComponents(contentBorder);
    },
  ],
};
