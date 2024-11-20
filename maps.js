const MAPS = {
  intro: {
    map: new Map({
      totalTilesX: 40,
      totalTilesY: 70,
      collisions: COLLISIONS_FIRST_MAP,
      doors: DOORS,
      backgroundImages: [`${CONFIG.assetsFolder}/first-map.png`],
      foregroundImages: [`${CONFIG.assetsFolder}/collisions.png`],
      startPosition: getCoordsByCell(16, 21),
    }),
  },
};
