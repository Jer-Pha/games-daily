/** @type {import('tailwindcss').Config} */
import * as constants from "./src/components/Constants";
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./src/components/*.{html,js}",
    "./src/*.{html,js}",
    "./public/*.{html,js}",
  ],
  theme: {
    extend: {
      maxHeight: {
        "[article-img]": `${constants.IMAGE_HEIGHT}px`,
      },
      width: {
        "[article-card]": `${constants.ARTICLE_WIDTH}px`,
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      const arrowButtons = {
        ".arrow-left": {
          position: "absolute",
          left: "1.25rem",
          top: `${constants.SCROLL_ARROWS_TOP}px`,
          color: "rgb(255 255 255 / var(--tw-text-opacity))",
          backgroundColor: "rgb(0 0 0 / var(--tw-bg-opacity))",
          borderColor: "rgb(255 255 255 / var(--tw-border-opacity))",
          borderWidth: `${constants.SCROLL_ARROWS_BORDER}px`,
          borderRadius: "9999px",
          "&:hover": {
            color: "rgb(229 231 235 / var(--tw-text-opacity))",
          },
        },
        ".arrow-right": {
          position: "absolute",
          right: "1.25rem",
          top: `${constants.SCROLL_ARROWS_TOP}px`,
          color: "rgb(255 255 255 / var(--tw-text-opacity))",
          backgroundColor: "rgb(0 0 0 / var(--tw-bg-opacity))",
          borderColor: "rgb(255 255 255 / var(--tw-border-opacity))",
          borderWidth: `${constants.SCROLL_ARROWS_BORDER}px`,
          borderRadius: "9999px",
          "&:hover": {
            color: "rgb(229 231 235 / var(--tw-text-opacity))",
          },
        },
      };

      addComponents(arrowButtons);
    }),
  ],
};
