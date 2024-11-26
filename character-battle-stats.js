class CharacterBattleStats {
  constructor({
    health = CONFIG.battle.characterStats.health.min,
    stamina = CONFIG.battle.characterStats.stamina.min,
    velocity = CONFIG.battle.characterStats.velocity.min,
    attacks = [],
    specialAttacks = [],
  }) {
    this.health = health;
    this.stamina = stamina;
    this.velocity = velocity;

    ["health", "stamina", "velocity"].forEach((param) => {
      if (
        this[param] < CONFIG.battle.characterStats[param].min ||
        this[param] > CONFIG.battle.characterStats[param].max
      ) {
        console.error(`Value ${this[param]} for param "${param}" is not valid`);
      }
    });

    this.attacks = attacks;
    this.specialAttacks = specialAttacks;
  }
}
