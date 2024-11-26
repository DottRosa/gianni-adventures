const CONFIG = {
  zoom: 500,
  typography: {
    fontFamily: "Comic Sans MS",
    textColor: "black",
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
  assetsFolder: "./assets",
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
    switchKey: "s",
    interactKey: "a",
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
    get arenaPadding() {
      return CONFIG.tile.tileDim;
    },
    characterStats: {
      health: {
        min: 20,
        max: 500,
      },
      stamina: {
        min: 50,
        max: 200,
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
