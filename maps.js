const MAPS = {
  intro: new Map({
    totalTilesX: 40,
    totalTilesY: 70,
    collisions: COLLISIONS_FIRST_MAP,
    doors: DOORS,
    backgroundImages: [`${CONFIG.assetsFolder}/first-map.png`],
    foregroundImages: [`${CONFIG.assetsFolder}/foreground.png`],
    startPosition: getCoordsByCell(16, 21),
    npcs: [
      new NPC({
        details: NPCS[NPCS_KEYS.furlanetto],
        mapPositionCell: {
          cellX: 17,
          cellY: 22,
        },
        dialogueManager: new DialogueManager(
          DIALOGUES.intro[NPCS_KEYS.furlanetto]
        ),
      }),
      new NPC({
        details: NPCS[NPCS_KEYS.cozza],
        mapPositionCell: {
          cellX: 36,
          cellY: 17,
        },
        dialogueManager: new DialogueManager(DIALOGUES.intro[NPCS_KEYS.cozza]),
      }),
    ],
  }),
};
