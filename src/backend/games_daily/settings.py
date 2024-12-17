from decouple import config

DEBUG = config("DEBUG", default=True, cast=bool)

ARTICLE_LIMIT = 10
PROMPT_LIMIT = 10

SITES = {
    "destructoid": "Destructoid",
    "dualshockers": "DualShockers",
    "engadget": "Engadget",
    "eurogamer": "Eurogamer",
    "gamedeveloper": "Game Developer",
    "gamerant": "Game Rant",
    "gameranx": "Gameranx",
    "gamesbeat": "GamesBeat",
    "gamesindustrybiz": "GamesIndustry.biz",
    "gamespot": "GameSpot",
    "gamesradar": "GamesRadar+",
    "gamingbolt": "GamingBolt",
    "gematsu": "Gematsu",
    "hardcoregamer": "Hardcore Gamer",
    "ign": "IGN",
    "indiegamesplus": "Indie Games Plus",
    "kotaku": "Kotaku",
    "mp1st": "MP1st",
    "nintendolife": "Nintendo Life",
    "pcgamer": "PC Gamer",
    "polygon": "Polygon",
    "purexbox": "Pure Xbox",
    "pushsquare": "Push Square",
    "rps": "Rock Paper Shotgun",
    "screenrant": "Screen Rant",
    "simulationdaily": "Simulation Daily",
    "theescapist": "The Escapist",
    "thegamepost": "The Game Post",
    "thegamer": "TheGamer",
    "thesixthaxis": "TheSixthAxis",
    "twistedvoxel": "Twisted Voxel",
    "vg247": "VG247",
    "vgc": "Video Games Chronicle",
}
