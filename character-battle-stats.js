class CharacterBattleStats {
  currentStatusEffect = null;

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

  alterHealth(value) {
    this.currentHealth = Math.ceil(this.currentHealth + value);
    if (this.currentHealth < 0) {
      this.currentHealth = 0;
    }
    if (this.currentHealth > this.health) {
      this.currentHealth = this.health;
    }
  }

  alterStamina(value) {
    this.currentStamina = Math.ceil(this.currentStamina + value);
    if (this.currentStamina < 0) {
      this.currentStamina = 0;
    }
    if (this.currentStamina > this.stamina) {
      this.currentStamina = this.stamina;
    }
  }

  dealStaminaUsage(usage) {
    this.currentStamina -= usage;
  }

  get hasStatusEffect() {
    return !!this.currentStatusEffect;
  }

  applyStatusEffect() {
    const variation = this.currentStatusEffect.getStatsVariation({
      health: this.health,
    });
    this.alterHealth(variation.health);
    this.alterStamina(variation.stamina);
  }

  reduceStatusEffectDuration() {
    this.statusEffectDuration--;
    if (this.statusEffectDuration === 0) {
      this.currentStatusEffect = null;
    }
  }

  setStatusEffect(statusEffect) {
    this.currentStatusEffect = statusEffect;
    if (statusEffect) {
      this.statusEffectDuration = statusEffect.duration;
    }
  }
}
