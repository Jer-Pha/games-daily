/** @type {import('tailwindcss').Config} */
// import { backIn } from "framer-motion";
import * as constants from "./src/components/Constants";

module.exports = {
  content: [
    "./src/components/*.{html,js}",
    "./src/*.{html,js}",
    "./public/*.{html,js}",
  ],
  safelist: ["animate-drawer-open", "animate-drawer-close"],
  theme: {
    screens: {
      tablet: "441px", // => @media (min-width: 441px) { ... }
      laptop: "1024px", // => @media (min-width: 1024px) { ... }
      desktop: "1400px", // => @media (min-width: 1280px) { ... }
    },
    extend: {
      maxHeight: {
        "[article-img]": `${constants.IMAGE_HEIGHT}px`,
      },
      width: {
        "[article-card]": `${constants.ARTICLE_WIDTH}px`,
      },
      minWidth: {
        "[article-card]": `${constants.ARTICLE_WIDTH}px`,
      },
      keyframes: {
        "open-drawer": {
          "0%": {
            opacity: "0",
            transform: "rotateX(-90deg)",
            transformOrigin: "top center",
            height: "0",
            paddingTop: "0",
          },
          "100%": {
            opacity: "1",
            transform: "none",
            height: "var(--drawer-height)",
          },
        },
        "close-drawer": {
          "0%": {
            opacity: "1",
            transform: "none",
            height: "var(--drawer-height)",
            paddingTop: "1rem",
          },
          "100%": {
            opacity: "0",
            transform: "rotateX(-90deg)",
            transformOrigin: "top center",
            height: "0",
          },
        },
      },
      animation: {
        "drawer-open": "open-drawer 250ms ease-out forwards",
        "drawer-close": "close-drawer 250ms ease-in forwards",
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
          borderTop: "2px solid var(--text-color)",
          borderRight: "2px solid var(--text-color)",
          borderBottom: "0",
          borderLeft: "2px solid var(--text-color)",
        },
        "article.selected div:has(h3)": {
          borderTop: "2px solid var(--text-color)",
          backgroundColor: "var(--text-color)",
          color: "var(--bg-color)",
        },
        "article.selected h3": {
          color: "var(--bg-color)",
        },
        "@media (hover: hover)": {
          "article:hover:not(.selected)": {
            backgroundColor: "var(--accent-color)",
            borderTop: "2px solid var(--text-color)",
            borderRight: "2px solid var(--text-color)",
            borderBottom: "0",
            borderLeft: "2px solid var(--text-color)",
          },
          "article:hover:not(.selected) div:has(h3)": {
            borderTop: "2px solid var(--text-color)",
            borderBottom: "2px solid var(--text-color)",
            backgroundColor: "var(--bg-color)",
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
        ".shadow-inner-bottom-left": {
          boxShadow:
            "inset 0px -4px 3px -4px var(--text-color), inset 4px 0px 3px -4px var(--text-color)",
        },
        ".shadow-inner-bottom-right": {
          boxShadow:
            "inset 0px -4px 3px -4px var(--text-color), inset -4px 0px 3px -4px var(--text-color)",
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
  ],
};
