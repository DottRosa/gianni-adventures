const CONFIG = {
  zoom: 500,
  typography: {
    fontFamily: "Comic Sans MS",
    textColor: "black",
    textAlign: "left",
  },
  tile: {
    realDim: 12,
    tilesPerX: 17,
    tilesPerY: 11,
    tilesFromCenterX: null,
    tilesFromCenterY: null,
    get tileDim() {
      return (this.realDim * CONFIG.zoom) / 100;
    },
    get canvasWidth() {
      return this.tileDim * this.tilesPerX;
    },
    get canvasHeight() {
      return this.tileDim * this.tilesPerY;
    },
  },
  assets: {
    folder: "./assets",
    attacks: "./assets/attacks",
  },
  player: {
    movementFrames: 12,
    get frameVelocity() {
      return CONFIG.tile.tileDim / this.movementFrames;
    },
    velocity: null,
    interactionArea: null,
    distanceBetweenPartners: 50,
    fabrissazzo: "fabrissazzo",
    gianni: "gianni",
    main: null,
    partner: null,
  },
  directions: {
    right: "right",
    left: "left",
  },
  keyboard: {
    interactionCooldown: 300,
    choicesCooldown: 100,
    animationCooldown: 50,
    switchKey: "s",
    interactKey: "z",
    cancelKey: "x",
  },
  dialogue: {
    fontSize: 13,
    fontFamily: "Comic Sans MS",
    textAlign: "left",
    fontNormal: null,
    fontBold: null,
    nameColor: "red",
    textColor: "black",
    balloon: {
      backgroundColor: "white",
      borderColor: "black",
      height: 75,
      width: 150,
    },
    status: {
      continue: "continue",
      stop: "stop",
      battle: "battle",
    },
  },
  battle: {
    get gapBetweenCharacters() {
      return CONFIG.tile.tileDim;
    },
    get arenaPaddingX() {
      return CONFIG.tile.tileDim * 2;
    },
    get arenaPaddingY() {
      return CONFIG.tile.tileDim / 2;
    },
    enemies: {
      standardDialogue: "Ora è il mio turno!",
    },
    characterStats: {
      health: {
        min: 20,
        max: 500,
      },
      stamina: {
        min: 1,
        max: 10,
      },
      velocity: {
        min: 1,
        max: 5,
      },
    },
    pointer: {
      width: 20,
      height: 20,
      border: {
        color: "black",
        width: 6,
      },
    },
    healthBar: {
      get verticalGap() {
        return CONFIG.tile.tileDim;
      },
      width: 200,
      height: 10,
      ranges: {
        high: {
          threshold: 0.5,
          color: "green",
        },
        medium: {
          threshold: 0.2,
          color: "orange",
        },
        low: {
          threshold: 0,
          color: "red",
        },
      },
      fontSize: 14,
      textAlign: "left",
      border: {
        color: "black",
        width: 2,
      },
      stamina: {
        gap: 5,
        radius: 3,
        color: "blue",
      },
    },
    actionBox: {
      marginBottom: 20,
      width: 300,
      height: 150,
      backgroundColor: "white",
      border: {
        color: "black",
        width: 1,
      },
      fontSize: 14,
      padding: 15,
      choices: {
        gap: 30,
      },
      shadow: {
        color: "rgba(0, 0, 0, 0.2)",
        blur: 10,
        offsetX: 10,
        offsetY: 10,
      },
      get maxItemsToDisplay() {
        const availableSpace = this.height - this.padding * 2;
        return Math.floor(availableSpace / (this.fontSize * 2));
      },
    },
    phases: {
      selection: "selection", // the characher decides which kind of action wants to execute
      attacksOptions: "attacksOptions", // the character has to chose an item from the selected action items list
      specialAttacksOptions: "specialAttacksOptions", // the character has to chose an item from the selected action items list
      backpackOptions: "backpackOptions", // the character has to chose an item from the selected action items list
      skipTurn: "skipTurn", // il giocatore skippa il proprio turno senza eseguire azioni
      target: "target", // the characher selectes the target of the selected action
      performAttack: "performAttack", // il personaggio attacca
    },
    turns: {
      radius: 30,
      backgroundColor: "white",
      currentTurnBackgroundColor: "yellow",
      gap: -20,
      quantityToDisplay: 8,
    },
  },
};

CONFIG.tile.tilesFromCenterX = Math.floor(CONFIG.tile.tilesPerX / 2);
CONFIG.tile.tilesFromCenterY = Math.floor(CONFIG.tile.tilesPerY / 2);

CONFIG.dialogue.fontNormal = `${CONFIG.dialogue.fontSize}px ${CONFIG.dialogue.fontFamily}`;
CONFIG.dialogue.fontBold = `bold ${CONFIG.dialogue.fontSize}px ${CONFIG.dialogue.fontFamily}`;

CONFIG.player.velocity = CONFIG.player.frameVelocity;
CONFIG.player.interactionArea = CONFIG.tile.tileDim;
CONFIG.player.main = CONFIG.player.gianni;
CONFIG.player.partner = CONFIG.player.fabrissazzo;

const ASSETS = {
  soundEffects: {
    footsteps: new Audio("assets/sound-effects/footsteps.mp3"),
    choices: new Audio("assets/sound-effects/choices.mp3"),
    selection: new Audio("assets/sound-effects/confirm.mp3"),
    cancel: new Audio("assets/sound-effects/cancel.mp3"),
    punch1: new Audio("assets/sound-effects/punch-1.mp3"),
    punch2: new Audio("assets/sound-effects/punch-2.mp3"),
    punch3: new Audio("assets/sound-effects/punch-3.mp3"),
    punch4: new Audio("assets/sound-effects/punch-4.mp3"),
    punch5: new Audio("assets/sound-effects/punch-5.mp3"),
    lightening: new Audio("assets/sound-effects/lightening.mp3"),
    arrow: new Audio("assets/sound-effects/arrow.mp3"),
    roar: new Audio("assets/sound-effects/roar.mp3"),
    damage: new Audio("assets/sound-effects/damage.wav"),
    heal: new Audio("assets/sound-effects/heal.mp3"),
  },
  music: {
    battle: new Audio("assets/music/battle.mp4"),
  },
};

const MAP_IDS = {
  intro: "intro",
  next: "next",
};

const MAP_OBJECT_IDS = {
  fiorellino: "fiorellino",
};

const NPC_IDS = {
  furlanetto: "furlanetto",
  cozza: "cozza",
};

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
