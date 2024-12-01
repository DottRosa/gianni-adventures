class Attack {
  constructor({
    name,
    description,
    damage = 0,
    targetEnemy = false, // indica che l'attacco può essere rivolto verso un nemico
    targetAllEnemies = false,
    targetSelf = false, // indica che l'attacco può essere rivolto a se stessi
    targetAlly = false, // indica che l'attacco può essere rivolto all'alleato
    targetAllPlayers = false,
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
    this.targetAllPlayers = targetAllPlayers;
    this.gif = gif;
    this.sound = sound;
    this.cost = cost;
    this.effect = effect;
    if (!this.effect) {
      this.effect = function ({ performer, targets, players }) {
        targets.forEach((target) => {
          target.characterBattleStats.dealDamage(this.damage);
        });
      };
    }
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
      description: "Un ceffone inferto con massima violenza",
      targetSelf: true,
      targetAlly: true,
      gif: GIFS[GIF_IDS.heal],
      sound: ASSETS.soundEffects.heal,
      effect: function ({ performer, targets }) {
        targets.forEach((target) => {
          target.characterBattleStats.recoverHealth(20);
        });
      },
    }),
    new Attack({
      name: "Cura personale",
      description: "Un ceffone inferto con massima violenza",
      targetSelf: true,
      gif: GIFS[GIF_IDS.heal],
      sound: ASSETS.soundEffects.heal,
    }),
    new Attack({
      name: "Cura generosa",
      description: "Un ceffone inferto con massima violenza",
      targetAlly: true,
      gif: GIFS[GIF_IDS.heal],
      sound: ASSETS.soundEffects.heal,
      cost: 3,
      effect: function ({ performer, targets }) {
        performer.characterBattleStats.recoverHealth(20);
      },
    }),
    new Attack({
      name: "Cura tutti",
      description: "Un pugno veemente, infligge gravi danni",
      targetAllPlayers: true,
      gif: GIFS[GIF_IDS.heal],
      sound: ASSETS.soundEffects.heal,
      effect: function ({ performer, targets }) {
        targets.forEach((target) => {
          target.characterBattleStats.recoverHealth(20);
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
      effect: function ({ performer, targets }) {
        targets.forEach((target) => {
          target.characterBattleStats.dealDamage(this.damage);
        });
        performer.characterBattleStats.dealDamage(20);
      },
    }),
    new Attack({
      name: "Fibonacci",
      description:
        "Pugni sferrati come la serie di Fibonacci. A partire dal nemico piu a sinistra, infligge danni pari a Fibonacci per 10, quindi 10, 10, 20, ...",
      damage: 0,
      targetAllEnemies: true,
      gif: GIFS[GIF_IDS.punch],
      sound: ASSETS.soundEffects.arrow,
      cost: 4,
      effect: function ({ targets }) {
        targets[0].characterBattleStats.dealDamage(10);
        targets[1].characterBattleStats.dealDamage(20);
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
      effect: function ({ targets }) {
        targets.forEach((target) => {
          target.characterBattleStats.dealDamage(this.damage);
        });
        Object.values(players).forEach((player) => {
          player.characterBattleStats.dealDamage(this.damage);
        });
      },
    }),
  ],
};
