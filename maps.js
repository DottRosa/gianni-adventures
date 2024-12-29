const MAPS = {
  [MAP_IDS.intro]: new Map({
    id: MAP_IDS.intro,
    totalTilesX: 50,
    totalTilesY: 50,
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
        dialogues: MAP_OBJECT_DIALOGUES.intro[MAP_OBJECT_IDS.fiorellino],
      }),
    ],
    backgroundImages: [`${CONFIG.assets.folder}/maps/5F.png`],
    foregroundImages: [`${CONFIG.assets.folder}/foreground.png`],
    startPosition: getCoordsByCell(16, 25),
  }),
  [MAP_IDS.next]: new Map({
    totalTilesX: 40,
    totalTilesY: 70,
    collisions: COLLISIONS_FIRST_MAP,
    backgroundImages: [`${CONFIG.assets.folder}/first-map.png`],
    foregroundImages: [`${CONFIG.assets.folder}/foreground.png`],
    startPosition: getCoordsByCell(34, 17),
  }),
};
