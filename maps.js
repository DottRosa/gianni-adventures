const MAPS = {
  [MAP_IDS.intro]: new Map({
    id: MAP_IDS.intro,
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
    mapObjects: [
      new MapObject({
        name: "Fiorellino",
        mapPositionCell: {
          cellX: 25,
          cellY: 18,
        },
        dialogueManager: new DialogueManager(
          MAP_OBJECT_DIALOGUES.intro[MAP_OBJECT_IDS.fiorellino]
        ),
      }),
    ],
    backgroundImages: [`${CONFIG.assetsFolder}/first-map.png`],
    foregroundImages: [`${CONFIG.assetsFolder}/foreground.png`],
    startPosition: getCoordsByCell(16, 21),
    npcs: NPCS.intro,
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
