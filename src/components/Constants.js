export const ARTICLE_WIDTH = 300;
export const IMAGE_HEIGHT = 158;
export const SCROLL_ARROWS_BORDER = 2;
export const ARROW_OPACITY =
  "text-opacity-45 border-opacity-45 bg-opacity-35 hover:text-opacity-70" +
  " hover:border-opacity-60 hover:bg-opacity-60";

export const SCROLL_ARROWS_TOP_DEFAULT = `calc(${Math.floor(
  ((100 / 16) * 9) / 2
)}vw - 16px + 48px - ${SCROLL_ARROWS_BORDER}px)`;
export const SCROLL_ARROWS_TOP_TABLET = `${
  Math.floor((IMAGE_HEIGHT - 32) / 2) + 48 - SCROLL_ARROWS_BORDER
}px`;
/*
The buttons are 32px tall, defined in the SVG files and the header
above the image is 48px (may have to worry about responsive sizes later)
*/
