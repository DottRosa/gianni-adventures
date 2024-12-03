class Player extends Character {
  isPlayer = true;

  constructor({
    spriteImages,
    startDirection = CONFIG.directions.right,
    name,
    characterBattleStats,
    attacks = [],
  }) {
    super({ spriteImages, startDirection, attacks, characterBattleStats });
    this.id = name.toLowerCase();
    this.name = name;
  }
}
