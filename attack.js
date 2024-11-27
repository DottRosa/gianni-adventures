class Attack {
  constructor({ name, description, damage, isAreaType = false }) {
    this.name = name;
    this.description = description;
    this.damage = damage;
    this.isAreaType = isAreaType;
  }
}

const ATTACKS = {
  [CONFIG.player.fabrissazzo]: [
    new Attack({
      name: "Ceffone",
      description: "Un ceffone inferto con massima violenza",
      damage: 1,
    }),
    new Attack({
      name: "Pugnazzo",
      description: "Un pugno veemente, infligge gravi danni",
      damage: 3,
    }),
    new Attack({
      name: "Ceffone 2",
      description: "Un ceffone inferto con massima violenza",
      damage: 1,
    }),
    new Attack({
      name: "Pugnazzo 2",
      description: "Un pugno veemente, infligge gravi danni",
      damage: 3,
    }),
    new Attack({
      name: "Ceffone 3",
      description: "Un ceffone inferto con massima violenza",
      damage: 1,
    }),
    new Attack({
      name: "Pugnazzo 3",
      description: "Un pugno veemente, infligge gravi danni",
      damage: 3,
    }),
  ],
};
