class Player extends Sprite {
  constructor({
    spriteImages,
    startDirection = CONFIG.directions.right,
    name,
    characterBattleStats,
  }) {
    super({ spriteImages, startDirection });
    this.name = name;
    this.characterBattleStats = characterBattleStats;
  }
}
