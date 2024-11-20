const MAP_IDS = {
  intro: "intro",
  next: "next",
};

const MAPS = {
  [MAP_IDS.intro]: new Map({
    totalTilesX: 40,
    totalTilesY: 70,
    collisions: COLLISIONS_FIRST_MAP,
    doors: [
      new Door({
        cellX: 16,
        cellY: 20,
        nextMapId: MAP_IDS.next,
      }),
    ],
    backgroundImages: [`${CONFIG.assetsFolder}/first-map.png`],
    foregroundImages: [`${CONFIG.assetsFolder}/foreground.png`],
    startPosition: getCoordsByCell(16, 21),
    npcs: [
      new NPC({
        details: NPCS[NPC_IDS.furlanetto],
        mapPositionCell: {
          cellX: 17,
          cellY: 22,
        },
        dialogueManager: new DialogueManager(
          DIALOGUES.intro[NPC_IDS.furlanetto]
        ),
      }),
      new NPC({
        details: NPCS[NPC_IDS.cozza],
        mapPositionCell: {
          cellX: 36,
          cellY: 17,
        },
        dialogueManager: new DialogueManager(DIALOGUES.intro[NPC_IDS.cozza]),
      }),
    ],
  }),
  [MAP_IDS.next]: new Map({
    totalTilesX: 40,
    totalTilesY: 70,
    collisions: COLLISIONS_FIRST_MAP,
    backgroundImages: [`${CONFIG.assetsFolder}/first-map.png`],
    foregroundImages: [`${CONFIG.assetsFolder}/foreground.png`],
    startPosition: getCoordsByCell(34, 17),
  }),
};
