class CharacterBattleStats {
  currentStatusEffect = null;

  _evasion = 1;
  _precision = 1;
  /*
  L'attacco base è 1 e permette di infliggere il danno indicato dall'attacco.
  Ogni variazione positiva all'attacco ne aumenta il valore. Per esempio un danno del
  20% aggiuntivo, significa che l'attacco vale 1.2
  */
  _attack = 1;
  /*
  Se la difesa vale 0, il danno subito sarà il 100%, se invece vale 1 allora il danno
  "parato" equivale al 100%. Ogni alterazione alla difesa aggiunge un valore compreso 
  tra 0 e 1. Se la difesa vale zero, ai fini dei calcoli del danno viene passato 1, così
  che la moltiplicazione con il danno restituisca il danno stesso. Stessa cosa se la difesa
  vale 0.2. Significa che vengono parati il 20% dei danni, cioè danno * 0.8, cioè 1-0.2.
  */
  _defense = 0;
  _healthRegeneration = 0;
  _staminaRegeneration = 0;

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

  /**
   * Restituisce il valore della difesa.
   * L'obbiettivo della difesa è ridurre il danno dell'attacco. Poichè tale calcolo
   * viene eseguito come una moltiplicazione tra il danno e la difesa, per farlo calare,
   * la difesa deve essere un valore tra 0 e 1. Per questo motivo viene restituito 1 - difesa.
   */
  get defense() {
    if (this.hasStatusEffect) {
      return 1 - this.currentStatusEffect.alterDefense(this._defense);
    }

    return 1 - this._defense;
  }

  get attack() {
    if (this.hasStatusEffect) {
      return this.currentStatusEffect.alterAttack(this._attack);
    }
    return this._attack;
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
