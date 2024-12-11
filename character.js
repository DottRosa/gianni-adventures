class Character extends Sprite {
  constructor({
    spriteImages,
    startDirection,
    attacks = [],
    characterBattleStats,
  }) {
    super({ spriteImages, startDirection });
    this.attacks = attacks;
    this.stats = characterBattleStats;
  }

  get freeAttacks() {
    return this.attacks.filter((a) => !a.hasCost);
  }

  get costAttacks() {
    return this.attacks.filter((a) => a.hasCost);
  }

  get isDefeated() {
    return this.stats.defeated;
  }

  drawStatusEffect() {
    const status = this.stats.currentStatusEffect;
    if (status) {
      status.draw([{ x: this.battlePosition.x, y: this.battlePosition.y }]);
    }
  }

  getAttackDamage(attack) {
    return Math.floor(attack.damage * this.stats.attack);
  }
}
