class Player extends Sprite {
  constructor({
    spriteImages,
    startDirection = CONFIG.directions.right,
    name,
    characterBattleStats,
    attacks,
  }) {
    super({ spriteImages, startDirection, attacks });
    this.name = name;
    this.characterBattleStats = characterBattleStats;
    this.attacks = attacks;
  }
}
