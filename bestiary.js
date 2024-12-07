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
};
