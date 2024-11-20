const MAPS = {
  intro: new Map({
    totalTilesX: 40,
    totalTilesY: 70,
    collisions: COLLISIONS_FIRST_MAP,
    doors: DOORS,
    backgroundImages: [`${CONFIG.assetsFolder}/first-map.png`],
    foregroundImages: [`${CONFIG.assetsFolder}/collisions.png`],
    startPosition: getCoordsByCell(16, 21),
    npcs: [
      new NPC({
        spriteImages: {
          left: `${CONFIG.assetsFolder}/npc-sprite.png`,
          right: `${CONFIG.assetsFolder}/npc-sprite.png`,
        },
        mapPositionCell: {
          cellX: 17,
          cellY: 22,
        },
        // background,
        // dialogueManager,
        name: "Furlanetto",
      }),
      new NPC({
        spriteImages: {
          left: `${CONFIG.assetsFolder}/npc-sprite.png`,
          right: `${CONFIG.assetsFolder}/npc-sprite.png`,
        },
        mapPositionCell: {
          cellX: 36,
          cellY: 17,
        },
        // background,
        // dialogue: dialogue,
        name: "Giulio",
      }),
    ],
  }),
};
