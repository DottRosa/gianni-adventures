class Attack {
  constructor({
    name,
    description,
    damage,
    canTargetEnemies = true, // indica che l'attacco può essere rivolto verso i nemici
    isAoE = false, // indica che tutti i nemici verranno colpiti
    canTargetSelf = false, // indica che l'attacco può essere rivolto a se stessi
    canTargetAlly = false, // indica che l'attacco può essere rivolto all'alleato
    gif,
    sound,
    cost = 0, // Indica il costo in stamina. Se è zero è un attacco normale, se maggiore è speciale
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
      damage: 1,
      canTargetEnemies: false,
      canTargetSelf: true,
      canTargetAlly: true,
      gif: GIFS[GIF_IDS.heal],
      sound: ASSETS.soundEffects.heal,
    }),
    new Attack({
      name: "Cura Personale",
      description: "Un ceffone inferto con massima violenza",
      damage: 1,
      canTargetEnemies: false,
      canTargetSelf: true,
      gif: GIFS[GIF_IDS.heal],
      sound: ASSETS.soundEffects.heal,
    }),
    new Attack({
      name: "Cura generosa",
      description: "Un ceffone inferto con massima violenza",
      damage: 1,
      canTargetEnemies: false,
      canTargetAlly: true,
      gif: GIFS[GIF_IDS.heal],
      sound: ASSETS.soundEffects.heal,
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
    }),
  ],
};
