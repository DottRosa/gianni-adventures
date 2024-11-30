class CharacterBattleStats {
  constructor({
    health = CONFIG.battle.characterStats.health.min,
    stamina = CONFIG.battle.characterStats.stamina.min,
    velocity = CONFIG.battle.characterStats.velocity.min,
    attacks = [],
    specialAttacks = [],
  }) {
    this.health = health;
    this.currentHealth = new Number(health);
    this.stamina = stamina;
    this.currentStamina = new Number(stamina);
    this.velocity = velocity;
    this.currentVelocity = new Number(velocity);

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

  dealDamage(damage) {
    this.currentHealth -= damage;
    if (this.currentHealth < 0) {
      this.currentHealth = 0;
    }
  }

  recoverHealth(amount) {
    this.currentHealth += amount;
    if (this.currentHealth > this.health) {
      this.currentHealth = this.health;
    }
  }

  dealStaminaUsage(usage) {
    this.currentStamina -= usage;
  }
}
