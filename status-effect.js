const STATUS_EFFECT_INFLUENCES = {
  // Modifiche al danno
  defenseIncrement: "defenseIncrement", // Riduzione percentuale del danno subito
  attackIncrement: "attackIncrement", // Incremento percentuale del danno inflitto

  // Probabilità e azioni
  actionProbability: "actionProbability", // Probabilità di eseguire un'azione
  evasionChance: "evasionChance", // Probabilità di evitare un attacco

  // Rigenerazione e degenerazione
  healthRegeneration: "healthRegeneration", // Percentuale di vita rigenerata per turno
  staminaRegeneration: "staminaRegeneration", // Quantità di stamina rigenerata per ogni turno
  healthDegeneration: "healthDegeneration", // Percentuale di vita persa per turno

  // Disabilitazioni e penalità
  skipTurn: "skipTurn", // Obliga a saltare un turno
};

class StatusEffect {
  currentFrame = 0;

  constructor({
    id,
    icon,
    name,
    description,
    gif,
    duration = 1, // durata in turni dell'effetto
    influence = {},
  }) {
    this.id = id;
    this.icon = icon;
    this.name = name;
    this.description = description;
    this.gif = gif;
    if (!gif) {
      this.gif = GIFS[GIF_IDS.aura];
    }
    this.influence = influence;
    this.duration = duration;
  }

  draw(x, y) {
    this.gif.animate(x, y);
  }

  alterDefense(value) {
    if (STATUS_EFFECT_INFLUENCES.defenseIncrement in this.influence) {
      return this.influence[STATUS_EFFECT_INFLUENCES.defenseIncrement];
    }
    return value;
  }

  alterAttack(value) {
    if (STATUS_EFFECT_INFLUENCES.attackIncrement in this.influence) {
      return (
        value + value * this.influence[STATUS_EFFECT_INFLUENCES.attackIncrement]
      );
    }
    return value;
  }

  getDamageVariation({ damage }) {
    const damageEffects = [
      STATUS_EFFECT_INFLUENCES.attackIncrement,
      STATUS_EFFECT_INFLUENCES.defenseIncrement,
    ];

    for (const effect of damageEffects) {
      if (STATUS_EFFECT_INFLUENCES[effect] in this.influence) {
        const influenceValue = this.influence[STATUS_EFFECT_INFLUENCES[effect]];
        const newDamage =
          effect === "attackIncrement"
            ? damage + damage * influenceValue
            : damage - damage * influenceValue;
        return newDamage - damage;
      }
    }

    return 0;
  }

  getStatsVariation({ health }) {
    const result = {
      health: 0,
      stamina: 0,
    };
    if (STATUS_EFFECT_INFLUENCES.healthDegeneration in this.influence) {
      const newHealth =
        health -
        health * this.influence[STATUS_EFFECT_INFLUENCES.healthDegeneration];
      result.health = newHealth - health;
    }
    if (STATUS_EFFECT_INFLUENCES.healthRegeneration in this.influence) {
      const newHealth =
        health +
        health * this.influence[STATUS_EFFECT_INFLUENCES.healthRegeneration];
      result.health = newHealth - health;
    }
    if (STATUS_EFFECT_INFLUENCES.staminaRegeneration in this.influence) {
      result.stamina =
        this.influence[STATUS_EFFECT_INFLUENCES.staminaRegeneration];
    }

    return result;
  }
}

const STATUS_EFFECTS = {
  // Negative effects
  blindness: new StatusEffect({
    id: "blindness",
    icon: "",
    name: "Cecità",
    description: "Chi ne è afflitto potrebbe non attaccare",
    gif: GIFS[GIF_IDS.dust],
    duration: 3,
    influence: {
      [STATUS_EFFECT_INFLUENCES.actionProbability]: 0.5, // 50% di probabilità di attaccare
    },
  }),
  poisoned: new StatusEffect({
    id: "poisoned",
    icon: "",
    name: "Avvelenamento",
    description: "Perde il 5% della vita totale ogni turno",
    duration: 5,
    influence: {
      [STATUS_EFFECT_INFLUENCES.healthDegeneration]: 0.05, // Perdita del 5% della vita
    },
  }),
  frozen: new StatusEffect({
    id: "frozen",
    icon: "",
    name: "Congelato",
    description: "Impossibile agire per 1 turno",
    duration: 1,
    influence: {
      [STATUS_EFFECT_INFLUENCES.skipTurn]: true, // Salta il turno
    },
  }),

  // Positive effects
  concentrated: new StatusEffect({
    id: "concentrated",
    icon: "",
    name: "Concentrato",
    description: "Ogni attacco infligge il 10% di danno in più",
    duration: 3,
    influence: {
      [STATUS_EFFECT_INFLUENCES.attackIncrement]: 0.1, // Incremento del danno del 10%
    },
  }),
  regeneration: new StatusEffect({
    id: "regeneration",
    icon: "",
    name: "Rigenerazione",
    description: "Recupera il 10% della vita totale ogni turno",
    duration: 3,
    influence: {
      [STATUS_EFFECT_INFLUENCES.healthRegeneration]: 0.1, // Rigenerazione del 10% della vita
    },
  }),
  staminaBoost: new StatusEffect({
    id: "staminaBoost",
    icon: "",
    name: "Resistenza Potenziata",
    description: "Recupera 1 punto stamina ogni turno",
    duration: 3,
    influence: {
      [STATUS_EFFECT_INFLUENCES.staminaRegeneration]: 1, // Rigenerazione della stamina
    },
  }),

  dodge: new StatusEffect({
    id: "dodge",
    icon: "",
    name: "Schivata",
    description: "Probabilità di evitare un attacco del 20%",
    duration: 2,
    influence: {
      [STATUS_EFFECT_INFLUENCES.evasionChance]: 0.2, // Incrementa del 20% la probabilità di schivata
    },
  }),

  ironSkin: new StatusEffect({
    id: "ironSkin",
    icon: "",
    name: "Petto Villoso",
    description: "Riduce i danni subiti del 20%",
    duration: 2,
    influence: {
      [STATUS_EFFECT_INFLUENCES.defenseIncrement]: 0.5,
    },
  }),
};
