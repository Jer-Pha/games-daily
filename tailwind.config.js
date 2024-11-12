/** @type {import('tailwindcss').Config} */
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
          "99%": {
            height: "200px",
          },
          "100%": {
            opacity: "1",
            transform: "none",
            minHeight: "200px",
            height: "auto",
            paddingTop: "1rem",
          },
        },
        "close-drawer": {
          "0%": {
            opacity: "1",
            transform: "none",
            height: "auto",
            paddingTop: "1rem",
          },
          "1%": {
            height: "200px",
          },
          "100%": {
            opacity: "0",
            transform: "rotateX(-90deg)",
            transformOrigin: "top center",
            height: "0",
            paddingTop: "0",
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
          backgroundColor: "var(--text-color)",
          border: "2px solid var(--text-color)",
          color: "var(--bg-color)",
        },
        "article.selected > img": {
          borderBottom: "2px solid var(--text-color)",
        },
        "@media (hover: hover)": {
          "article:hover:not(.selected)": {
            backgroundColor: "var(--accent-color)",
            border: "2px solid var(--text-color)",
          },
          "article:hover:not(.selected) > img": {
            borderBottom: "2px solid var(--text-color)",
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
  ],
};
