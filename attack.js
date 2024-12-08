class Attack {
  constructor({
    name,
    description,
    damage = 0,
    targetEnemy = false, // indica che l'attacco può essere rivolto verso un nemico
    targetAllEnemies = false,
    targetSelf = false, // indica che l'attacco può essere rivolto a se stessi
    targetAlly = false, // indica che l'attacco può essere rivolto all'alleato
    targetAllAlliesGroup = false,
    targetAll = false, // indica che l'attacco coinvolge tutti
    gif,
    sound,
    cost = 0, // Indica il costo in stamina. Se è zero è un attacco normale, se maggiore è speciale
    targetEffect,
    performerEffect,
  }) {
    this.name = name;
    this.description = description;
    this.damage = damage;
    this.targetEnemy = targetEnemy;
    this.targetSelf = targetSelf;
    this.targetAlly = targetAlly;
    this.targetAll = targetAll;
    this.targetAllEnemies = targetAllEnemies;
    this.targetAllAlliesGroup = targetAllAlliesGroup;
    this.gif = gif;
    this.sound = sound;
    this.cost = cost;
    this.targetEffect = targetEffect;
    if (!this.targetEffect) {
      this.targetEffect = function ({ healthAlteration, target, index }) {
        target.stats.alterHealth(healthAlteration);
      };
    }
    this.performerEffect = performerEffect;
    if (!this.performerEffect) {
      this.performerEffect = function ({ healthAlteration, performer }) {};
    }
  }

  calculateDamage({ performer, target }) {
    console.log(this.damage, performer.stats.attack, target.stats.defense);
    return -1 * this.damage * performer.stats.attack * target.stats.defense;
  }

  execute({ performer, targets }) {
    targets.forEach((target, index) => {
      const targetHealthAlteration = this.calculateDamage({
        target,
        performer,
      });

      this.targetEffect({
        healthAlteration: targetHealthAlteration,
        target,
        index,
      });
    });
  }

  resetAnimation() {
    this.gif.reset();
  }

  animate(positions = []) {
    if (this.sound) {
      this.sound.play();
    }
    this.gif.animate(positions);
  }

  animationIsFinished() {
    return this.gif.finished;
  }

  get hasCost() {
    return !!this.cost;
  }
}

const ATTACKS = {
  [NPC_IDS.furlanetto]: [
    new Attack({
      name: "Ceffone",
      description: "Un ceffone inferto con massima violenza",
      targetEnemy: true,
      damage: 20,
      gif: GIFS[GIF_IDS.dragon],
      sound: ASSETS.soundEffects.roar,
    }),
    new Attack({
      name: "Pugnazzo ad area",
      description: "Un pugno veemente, infligge gravi danni",
      damage: 30,
      targetAllEnemies: true,
      gif: GIFS[GIF_IDS.punch],
      sound: ASSETS.soundEffects.arrow,
      cost: 1,
    }),
  ],
  [NPC_IDS.cozza]: [
    // new Attack({
    //   name: "Cura",
    //   description: "Cura",
    //   targetAlly: true,
    //   gif: GIFS[GIF_IDS.healing],
    //   sound: ASSETS.soundEffects.heal,
    //   targetEffect: function ({ healthAlteration, target, index }) {
    //     target.stats.alterHealth(20);
    //   },
    // }),
    new Attack({
      name: "Grasso di ciccio",
      description: "Permette ad un alleato di recuperare vita nel tempo",
      targetAlly: true,
      gif: GIFS[GIF_IDS.healing],
      sound: ASSETS.soundEffects.heal,
      targetEffect: function ({ healthAlteration, target, index }) {
        target.stats.setStatusEffect(STATUS_EFFECTS.poisoned);
      },
    }),
    // new Attack({
    //   name: "Iron skin",
    //   description: "Cura il bersaglio di 5 punti e lo rende Ironschinnoso",
    //   targetAlly: true,
    //   gif: GIFS[GIF_IDS.healing],
    //   sound: ASSETS.soundEffects.heal,
    //   targetEffect: function ({ healthAlteration, target, index }) {
    //     target.stats.setStatusEffect(STATUS_EFFECTS.ironSkin);
    //     target.stats.alterHealth(5);
    //   },
    // }),
  ],
  [CONFIG.player.gianni]: [
    new Attack({
      name: "Rallenta",
      description:
        "Rallenta un avversario, riducendone la velocità di un punto",
      targetEnemy: true,
      damage: 0,
      gif: GIFS[GIF_IDS.punch],
      sound: ASSETS.soundEffects.arrow,
    }),
    new Attack({
      name: "Stamina boost",
      description: "Il bersaglio ottiene lo status 'Debilitazione'",
      targetAlly: true,
      damage: 0,
      gif: GIFS[GIF_IDS.punch],
      sound: ASSETS.soundEffects.arrow,
      targetEffect: function ({ healthAlteration, target, index }) {
        target.stats.setStatusEffect(STATUS_EFFECTS.staminaBoost);
      },
    }),
    new Attack({
      name: "Concentrati Fabris!",
      description: "Permette a Fabris di diventare 'Concentrato'",
      targetAlly: true,
      damage: 0,
      gif: GIFS[GIF_IDS.punch],
      sound: ASSETS.soundEffects.arrow,
      targetEffect: function ({ healthAlteration, target, index }) {
        target.stats.setStatusEffect(STATUS_EFFECTS.concentrated);
      },
    }),
  ],
  [CONFIG.player.fabrissazzo]: [
    new Attack({
      name: "Ceffone",
      description: "Un ceffone inferto con massima violenza",
      targetEnemy: true,
      damage: 20,
      gif: GIFS[GIF_IDS.punch],
      sound: ASSETS.soundEffects.arrow,
      targetEffect: function ({ healthAlteration, target, index }) {
        target.stats.alterHealth(healthAlteration);
      },
      performerEffect: function ({ healthAlteration, performer }) {},
    }),
    new Attack({
      name: "Pugnazzo ad area",
      description: "Un pugno veemente, infligge gravi danni",
      damage: 30,
      targetAllEnemies: true,
      gif: GIFS[GIF_IDS.punch],
      sound: ASSETS.soundEffects.arrow,
      cost: 1,
    }),
    new Attack({
      name: "Cura",
      description: "Cura se stesso o un alleato",
      targetSelf: true,
      targetAlly: true,
      gif: GIFS[GIF_IDS.healing],
      sound: ASSETS.soundEffects.heal,
      targetEffect: function ({ healthAlteration, target, index }) {
        target.stats.alterHealth(20);
      },
    }),
    new Attack({
      name: "Cura personale",
      description: "Cura se stesso",
      targetSelf: true,
      gif: GIFS[GIF_IDS.healing],
      sound: ASSETS.soundEffects.heal,
      targetEffect: function ({ healthAlteration, target, index }) {
        target.stats.alterHealth(20);
      },
    }),
    new Attack({
      name: "Polvere negli occhi",
      description: "Lancia della polvere negli occhi. Induce Cecità",
      targetEnemy: true,
      gif: GIFS[GIF_IDS.healing],
      sound: ASSETS.soundEffects.heal,
      cost: 2,
      targetEffect: function ({ healthAlteration, target, index }) {
        target.stats.setStatusEffect(STATUS_EFFECTS.blindness);
      },
    }),
    new Attack({
      name: "Debilitazione",
      description: "Riduce i danni inferti dal tuo avversario",
      targetEnemy: true,
      gif: GIFS[GIF_IDS.healing],
      sound: ASSETS.soundEffects.heal,
      cost: 1,
      targetEffect: function ({ healthAlteration, target, index }) {
        target.stats.setStatusEffect(STATUS_EFFECTS.debilitation);
      },
    }),
    new Attack({
      name: "Cura tutti",
      description: "Cura tutti gli alleati compreso se stesso",
      targetAllAlliesGroup: true,
      gif: GIFS[GIF_IDS.healing],
      sound: ASSETS.soundEffects.heal,
      targetEffect: function ({ healthAlteration, target, index }) {
        target.stats.alterHealth(20);
      },
    }),
    new Attack({
      name: "π/2",
      description:
        "Potentissimo attacco che sfrutta un angolo di 90°. L'esecutore subisce 20 danni",
      damage: 50,
      targetEnemy: true,
      gif: GIFS[GIF_IDS.punch],
      sound: ASSETS.soundEffects.arrow,
      cost: 4,
      targetEffect: function ({ healthAlteration, target }) {
        target.stats.alterHealth(healthAlteration);
      },
      performerEffect: function ({ healthAlteration, performer }) {
        performer.stats.alterHealth(-20);
      },
    }),
    new Attack({
      name: "Fibonacci",
      description:
        "Pugni sferrati come la serie di Fibonacci. A partire dal nemico piu a sinistra, infligge danni pari a Fibonacci per 10, quindi 10, 10, 20, ...",
      damage: 10,
      targetAllEnemies: true,
      gif: GIFS[GIF_IDS.punch],
      sound: ASSETS.soundEffects.arrow,
      cost: 4,
      targetEffect: function ({ healthAlteration, target, index }) {
        target.stats.alterHealth(healthAlteration + 10 * index);
      },
    }),
    new Attack({
      name: "Ma che oooh!",
      description: "Un urlo che percuote gli organi interni. Danneggia tutti.",
      damage: 20,
      targetAll: true,
      gif: GIFS[GIF_IDS.punch],
      sound: ASSETS.soundEffects.arrow,
      cost: 4,
      targetEffect: function ({ healthAlteration, target, index }) {
        target.stats.alterHealth(healthAlteration);
      },
    }),
  ],
};
