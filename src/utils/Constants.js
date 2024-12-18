export const ARTICLE_WIDTH = 300;
export const ARTICLE_TOLERANCE = 10;
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

export const SITES = {
  destructoid: "Destructoid",
  dualshockers: "DualShockers",
  engadget: "Engadget",
  eurogamer: "Eurogamer",
  gamedeveloper: "Game Developer",
  gamerant: "Game Rant",
  gameranx: "Gameranx",
  gamesbeat: "GamesBeat",
  gamesindustrybiz: "GamesIndustry.biz",
  gamespot: "GameSpot",
  gamesradar: "GamesRadar+",
  gamingbolt: "GamingBolt",
  gematsu: "Gematsu",
  hardcoregamer: "Hardcore Gamer",
  ign: "IGN",
  indiegamesplus: "Indie Games Plus",
  kotaku: "Kotaku",
  mp1st: "MP1st",
  nintendolife: "Nintendo Life",
  pcgamer: "PC Gamer",
  polygon: "Polygon",
  purexbox: "Pure Xbox",
  pushsquare: "Push Square",
  rps: "Rock Paper Shotgun",
  screenrant: "Screen Rant",
  simulationdaily: "Simulation Daily",
  theescapist: "The Escapist",
  thegamepost: "The Game Post",
  thegamer: "TheGamer",
  vg247: "VG247",
  vgc: "Video Games Chronicle",
};
