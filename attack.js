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
    effect,
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
    this.effect = effect;
    if (!this.effect) {
      this.effect = function ({ damage, performer, targets, players }) {
        targets.forEach((target) => {
          target.stats.alterHealth(damage);
        });
      };
    }
  }

  calculateDamage({ performer, targets }) {
    return this.damage;
  }

  execute({ performer, targets, players }) {
    const damage = this.calculateDamage({ performer, targets });
    this.effect({ damage, performer, targets, players });
  }

  resetAnimation() {
    this.gif.reset();
  }

  animate(x, y, propagations = []) {
    if (this.sound) {
      this.sound.play();
    }
    this.gif.animate(x, y, propagations);
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
    new Attack({
      name: "Cura",
      description: "Cura",
      targetSelf: true,
      targetAlly: true,
      gif: GIFS[GIF_IDS.healing],
      sound: ASSETS.soundEffects.heal,
      effect: function ({ performer, targets }) {
        targets.forEach((target) => {
          target.stats.alterHealth(20);
        });
      },
    }),
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
  ],
  [CONFIG.player.fabrissazzo]: [
    new Attack({
      name: "Ceffone",
      description: "Un ceffone inferto con massima violenza",
      targetEnemy: true,
      damage: 20,
      gif: GIFS[GIF_IDS.punch],
      sound: ASSETS.soundEffects.arrow,
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
      effect: function ({ performer, targets }) {
        targets.forEach((target) => {
          target.stats.alterHealth(20);
        });
      },
    }),
    new Attack({
      name: "Cura personale",
      description: "Cura se stesso",
      targetSelf: true,
      gif: GIFS[GIF_IDS.healing],
      sound: ASSETS.soundEffects.heal,
    }),
    new Attack({
      name: "Polvere negli occhi",
      description: "Lancia della polvere negli occhi. Induce Cecità",
      targetEnemy: true,
      gif: GIFS[GIF_IDS.healing],
      sound: ASSETS.soundEffects.heal,
      cost: 2,
      effect: function ({ performer, targets }) {
        targets[0].stats.setStatusEffect(STATUS_EFFECTS.blindness);
      },
    }),
    new Attack({
      name: "Cura tutti",
      description: "Un pugno veemente, infligge gravi danni",
      targetAllAlliesGroup: true,
      gif: GIFS[GIF_IDS.healing],
      sound: ASSETS.soundEffects.heal,
      effect: function ({ performer, targets }) {
        targets.forEach((target) => {
          target.stats.alterHealth(20);
        });
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
      effect: function ({ damage, performer, targets }) {
        targets.forEach((target) => {
          target.stats.alterHealth(-1 * damage);
        });
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
      effect: function ({ damage, targets }) {
        targets[0].stats.alterHealth(-1 * damage);
        targets[1].stats.alterHealth(-1 * damage + 10);
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
      effect: function ({ damage, targets, players }) {
        targets.forEach((target) => {
          target.stats.alterHealth(-1 * damage);
        });
        players.forEach((player) => {
          player.stats.alterHealth(-1 * damage);
        });
      },
    }),
  ],
};
