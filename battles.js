const BATTLES = {
  [MAP_IDS.intro]: {
    firstBattle: new Battle({
      enemies: [
        NPCS[MAP_IDS.intro].furlanetto,
        NPCS[MAP_IDS.intro].cozza,
        NPCS[MAP_IDS.intro].tumus,
      ],
    }),
  },
};
