// https://tibia.fandom.com/wiki/Category:Attack_Effects

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
    animations: "./assets/animations",
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
    leftTriggerKey: "a",
    rightTriggerKey: "d",
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
      backgroundColor: "#FFF",
      borderColor: "black",
      height: 75,
      width: 150,
    },
    status: {
      continue: "continue",
      stop: "stop",
      battle: "battle",
    },
    hotkeys: {
      gap: 5,
      height: 20,
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
      get horizontalGap() {
        // return CONFIG.tile.tileDim;
        return 150;
      },
      areaPaddingX: 50,
      width: 100,
      height: 10,
      statBarGap: 25, // distanza tra la statistica, tipo HP, e la relativa barra
      statsVerticalGap: 25, // distanza verticale tra le varie righe di statistiche
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
      fontSize: 12,
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
      backgroundColor: "#FFF",
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
      backgroundColor: "#FFF",
      currentTurnBackgroundColor: "yellow",
      gap: -20,
      quantityToDisplay: 4,
    },
  },
  briscola: {
    phases: {
      partnerChoice: "partnerChoice", // il giocatore sceglie il suo partner
      partnerConfirmation: "partnerConfirmation", // il giocatore conferma il partner scelto
      gameStart: "gameStart",
    },
    partnerSelection: {
      cell: 75, // larghezza e altezza della cella di un partner
      detailsBox: {
        height: 350,
        fontName: "bold 25px Comic Sans MS",
        fontTitle: "bold 13px Comic Sans MS",
        fontDescription: "11px Comic Sans MS",
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
    wrong: new Audio("assets/sound-effects/wrong.mp3"),
  },
  music: {
    battle: new Audio("assets/music/battle.mp4"),
  },
  images: {
    ghostRight: "assets/ghost-sprite-right.png",
    ghostLeft: "assets/ghost-sprite-left.png",
    lock: "assets/lock.png",
  },
};

const lockImage = new Image();
lockImage.src = ASSETS.images.lock;

const MAP_IDS = {
  intro: "intro",
  next: "next",
};

const MAP_OBJECT_IDS = {
  fiorellino: "fiorellino",
};

const NPC_IDS = {
  // buoni
  furlanetto: "furlanetto",
  cozza: "cozza",
  tumus: "tumus",
  tartaglione: "tartaglione",
  simonato: "simonato",
  rosa: "rosa",
  cristante: "cristante",
  ceccobelli: "ceccobelli",
  denis: "denis",
  pisani: "pisani",
  selva: "selva",
  tramontin: "tramontin",
  depol: "depol",
  carrellino: "carrellino", // di depol
  maiullari: "maiullari",
  preside: "preside",
  doni: "doni",

  // cattivi
  crosilla: "crosilla",
  sbriz: "sbriz",
  tesolin: "tesolin",
  villalta: "villalta",
  librincomodato: "librincomodato",
  eliana: "eliana", // la bidella
  smithers: "smithers",
  pilot: "pilot",
  colussi: "colussi",
  forte: "forte",
};

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const BUTTONS = {
  ok: {
    key: CONFIG.keyboard.interactKey,
    label: "Ok",
  },
  confirm: {
    key: CONFIG.keyboard.interactKey,
    label: "Conferma",
  },
  back: {
    key: CONFIG.keyboard.cancelKey,
    label: "Indietro",
  },
  horizontalScroll: {
    key: "⇄",
    label: "Scorri",
  },
  briscolaPlayerDetails: {
    key: CONFIG.keyboard.rightTriggerKey,
    label: "Mostra le statistiche",
  },
  briscolaPlayerDetailsBack: {
    key: CONFIG.keyboard.rightTriggerKey,
    label: "Mostra le abilità",
  },
};

Object.keys(BUTTONS).forEach((key) => {
  ctx.font = "bold 13px Arial";
  BUTTONS[key].width = ctx.measureText(BUTTONS[key].label).width + 30;
});
