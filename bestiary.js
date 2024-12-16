const BESTIARY = {
  [NPC_IDS.furlanetto]: {
    firstName: "Carlo",
    lastName: "Furlanetto",
    spriteImages: {
      left: `${CONFIG.assets.folder}/npc-sprite.png`,
      right: `${CONFIG.assets.folder}/npc-sprite.png`,
    },
    description: "",
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    nickname: {
      [CONFIG.player.fabrissazzo]: "Furly",
      [CONFIG.player.gianni]: "Carlo",
    },
  },
  [NPC_IDS.cozza]: {
    firstName: "Marco",
    lastName: "Cozzarini",
    spriteImages: {
      left: `${CONFIG.assets.folder}/cozza.png`,
      right: `${CONFIG.assets.folder}/cozza.png`,
    },
    description: "",
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    nickname: {
      [CONFIG.player.fabrissazzo]: "Ciccio Cozza",
      [CONFIG.player.gianni]: "Cozzarini",
    },
  },
  [NPC_IDS.tumus]: {
    firstName: "Tomas",
    lastName: "Bertolin",
    spriteImages: {
      left: `${CONFIG.assets.folder}/cozza.png`,
      right: `${CONFIG.assets.folder}/cozza.png`,
    },
    description: "",
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    nickname: {
      [CONFIG.player.fabrissazzo]: "Tumus Culattone",
      [CONFIG.player.gianni]: "Bertolin",
    },
  },
  [NPC_IDS.tartaglione]: {
    firstName: "Mirko",
    lastName: "Tartaglione",
    spriteImages: {
      left: `${CONFIG.assets.folder}/cozza.png`,
      right: `${CONFIG.assets.folder}/cozza.png`,
    },
    description: "",
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    nickname: {
      [CONFIG.player.fabrissazzo]: "Tàrtàgliōne",
      [CONFIG.player.gianni]: "Tartaglione",
    },
  },
  [NPC_IDS.simonato]: {
    firstName: "Adrea",
    lastName: "Simonato",
    spriteImages: {
      left: `${CONFIG.assets.folder}/cozza.png`,
      right: `${CONFIG.assets.folder}/cozza.png`,
    },
    description: "",
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    nickname: {
      [CONFIG.player.fabrissazzo]: "Simonella",
      [CONFIG.player.gianni]: "Simonato",
    },
  },
  [NPC_IDS.rosa]: {
    firstName: "Marco",
    lastName: "Rosa",
    spriteImages: {
      left: `${CONFIG.assets.folder}/cozza.png`,
      right: `${CONFIG.assets.folder}/cozza.png`,
    },
    description: "",
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    nickname: {
      [CONFIG.player.fabrissazzo]: "Il Rosa",
      [CONFIG.player.gianni]: "Rosa",
    },
  },
  [NPC_IDS.cristante]: {
    firstName: "Dario",
    lastName: "Cristante",
    spriteImages: {
      left: `${CONFIG.assets.folder}/cozza.png`,
      right: `${CONFIG.assets.folder}/cozza.png`,
    },
    description: "",
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    nickname: {
      [CONFIG.player.fabrissazzo]: "Cristante",
      [CONFIG.player.gianni]: "Dario",
    },
  },
  [NPC_IDS.ceccobelli]: {
    firstName: "Sergio",
    lastName: "Ceccobelli",
    spriteImages: {
      left: `${CONFIG.assets.folder}/cozza.png`,
      right: `${CONFIG.assets.folder}/cozza.png`,
    },
    description: "",
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    nickname: {
      [CONFIG.player.fabrissazzo]: "Cecco",
      [CONFIG.player.gianni]: "Sergio",
    },
  },
  [NPC_IDS.denis]: {
    firstName: "Denis",
    lastName: "Francescutti",
    spriteImages: {
      left: `${CONFIG.assets.folder}/cozza.png`,
      right: `${CONFIG.assets.folder}/cozza.png`,
    },
    description: "",
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    nickname: {
      [CONFIG.player.fabrissazzo]: "Denis",
      [CONFIG.player.gianni]: "Francescutti",
    },
  },
};
