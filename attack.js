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
  }) {
    this.name = name;
    this.description = description;
    this.damage = damage;
    this.canTargetEnemies = canTargetEnemies;
    this.isAoE = isAoE;
    this.canTargetSelf = canTargetSelf;
    this.canTargetAlly = canTargetAlly;
    this.gif = gif;
  }

  resetAnimation() {
    this.gif.reset();
  }

  animate(x, y) {
    this.gif.animate(x, y);
  }

  animationIsFinished() {
    return this.gif.finished;
  }
}

const ATTACKS = {
  [CONFIG.player.fabrissazzo]: [
    new Attack({
      name: "Ceffone",
      description: "Un ceffone inferto con massima violenza",
      damage: 20,
      gif: new GIF({
        folderName: "explosion",
        totalFrames: 10,
      }),
    }),
    new Attack({
      name: "Pugnazzo ad area",
      description: "Un pugno veemente, infligge gravi danni",
      damage: 3,
      isAoE: true,
    }),
    new Attack({
      name: "Cura",
      description: "Un ceffone inferto con massima violenza",
      damage: 1,
      canTargetEnemies: false,
      canTargetSelf: true,
      canTargetAlly: true,
    }),
    new Attack({
      name: "Cura Personale",
      description: "Un ceffone inferto con massima violenza",
      damage: 1,
      canTargetEnemies: false,
      canTargetSelf: true,
    }),
    new Attack({
      name: "Cura generosa",
      description: "Un ceffone inferto con massima violenza",
      damage: 1,
      canTargetEnemies: false,
      canTargetAlly: true,
    }),
    new Attack({
      name: "Cura tutti",
      description: "Un pugno veemente, infligge gravi danni",
      isAoE: true,
      canTargetEnemies: false,
    }),
  ],
};
