class Attack {
  constructor({
    name,
    description,
    damage = 0,
    canTargetEnemies = true, // indica che l'attacco può essere rivolto verso i nemici
    isAoE = false, // indica che tutti i nemici verranno colpiti
    canTargetSelf = false, // indica che l'attacco può essere rivolto a se stessi
    canTargetAlly = false, // indica che l'attacco può essere rivolto all'alleato
    gif,
    sound,
    cost = 0, // Indica il costo in stamina. Se è zero è un attacco normale, se maggiore è speciale
    effect,
  }) {
    this.name = name;
    this.description = description;
    this.damage = damage;
    this.canTargetEnemies = canTargetEnemies;
    this.isAoE = isAoE;
    this.canTargetSelf = canTargetSelf;
    this.canTargetAlly = canTargetAlly;
    this.gif = gif;
    this.sound = sound;
    this.cost = cost;
    this.effect = effect;
    if (!this.effect) {
      this.effect = ({ performer, targets, players }) => {
        targets.forEach((target) => {
          target.characterBattleStats.dealDamage(this.damage);
        });
      };
    }
  }

  resetAnimation() {
    this.gif.reset();
  }

  animate(
    x,
    y,
    propagation = {
      quantity: 0,
      amount: 0,
    }
  ) {
    if (this.sound) {
      this.sound.play();
    }
    this.gif.animate(x, y, propagation);
  }

  animationIsFinished() {
    return this.gif.finished;
  }

  get hasCost() {
    return !!this.cost;
  }
}

const ATTACKS = {
  [CONFIG.player.fabrissazzo]: [
    new Attack({
      name: "Ceffone",
      description: "Un ceffone inferto con massima violenza",
      damage: 20,
      gif: GIFS[GIF_IDS.punch],
      sound: ASSETS.soundEffects.arrow,
    }),
    new Attack({
      name: "Pugnazzo ad area",
      description: "Un pugno veemente, infligge gravi danni",
      damage: 30,
      isAoE: true,
      gif: GIFS[GIF_IDS.punch],
      sound: ASSETS.soundEffects.arrow,
      cost: 1,
    }),
    new Attack({
      name: "Cura",
      description: "Un ceffone inferto con massima violenza",
      canTargetEnemies: false,
      canTargetSelf: true,
      canTargetAlly: true,
      gif: GIFS[GIF_IDS.heal],
      sound: ASSETS.soundEffects.heal,
      effect: ({ performer, targets }) => {
        targets.forEach((target) => {
          target.characterBattleStats.recoverHealth(20);
        });
      },
    }),
    new Attack({
      name: "Cura personale",
      description: "Un ceffone inferto con massima violenza",
      canTargetEnemies: false,
      canTargetSelf: true,
      gif: GIFS[GIF_IDS.heal],
      sound: ASSETS.soundEffects.heal,
    }),
    new Attack({
      name: "Cura generosa",
      description: "Un ceffone inferto con massima violenza",
      canTargetEnemies: false,
      canTargetAlly: true,
      gif: GIFS[GIF_IDS.heal],
      sound: ASSETS.soundEffects.heal,
      cost: 3,
      effect: ({ performer, targets }) => {
        performer.characterBattleStats.recoverHealth(20);
      },
    }),
    new Attack({
      name: "Cura tutti",
      description: "Un pugno veemente, infligge gravi danni",
      isAoE: true,
      canTargetAlly: true,
      canTargetSelf: true,
      canTargetEnemies: false,
      gif: GIFS[GIF_IDS.heal],
      sound: ASSETS.soundEffects.heal,
      effect: ({ performer, targets }) => {
        targets.forEach((target) => {
          target.characterBattleStats.recoverHealth(20);
        });
      },
    }),
    new Attack({
      name: "π/2",
      description:
        "Potentissimo attacco che sfrutta un angolo di 90°. L'esecutore subisce 20 danni",
      isAoE: true,
      damage: 50,
      canTargetEnemies: true,
      gif: GIFS[GIF_IDS.punch],
      sound: ASSETS.soundEffects.arrow,
      cost: 4,
      effect: ({ performer, targets }) => {
        targets.forEach((target) => {
          target.characterBattleStats.dealDamage(50);
        });
        performer.characterBattleStats.dealDamage(20);
      },
    }),
    new Attack({
      name: "Fibonacci",
      description:
        "Pugni sferrati come la serie di Fibonacci. A partire dal nemico piu a sinistra, infligge danni pari a Fibonacci per 10, quindi 10, 10, 20, ...",
      isAoE: true,
      damage: 0,
      canTargetEnemies: true,
      gif: GIFS[GIF_IDS.punch],
      sound: ASSETS.soundEffects.arrow,
      cost: 4,
      effect: ({ targets }) => {
        targets[0].characterBattleStats.dealDamage(10);
        targets[1].characterBattleStats.dealDamage(20);
      },
    }),
    new Attack({
      name: "Ma che oooh!",
      description: "Un urlo che percuote gli organi interni. Danneggia tutti.",
      isAoE: true,
      damage: 20,
      canTargetEnemies: true,
      gif: GIFS[GIF_IDS.punch],
      sound: ASSETS.soundEffects.arrow,
      cost: 4,
      effect: ({ targets }) => {
        targets.forEach((target) => {
          target.characterBattleStats.dealDamage(20);
        });
        Object.values(players).forEach((player) => {
          player.characterBattleStats.dealDamage(20);
        });
      },
    }),
  ],
};
