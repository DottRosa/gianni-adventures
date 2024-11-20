const NPCS_KEYS = {
  furlanetto: "furlanetto",
  cozza: "cozza",
};

const NPCS = {
  [NPCS_KEYS.furlanetto]: {
    firstName: "Carlo",
    lastName: "Furlanetto",
    spriteImages: {
      left: `${CONFIG.assetsFolder}/npc-sprite.png`,
      right: `${CONFIG.assetsFolder}/npc-sprite.png`,
    },
    description: "",
    fullName: () => {
      return `${this.firstName} ${this.lastName}`;
    },
    nickname: {
      [CONFIG.player.fabrissazzo]: "Furly",
      [CONFIG.player.gianni]: "Carlo",
    },
  },
  [NPCS_KEYS.cozza]: {
    firstName: "Marco",
    lastName: "Cozzarini",
    spriteImages: {
      left: `${CONFIG.assetsFolder}/npc-sprite.png`,
      right: `${CONFIG.assetsFolder}/npc-sprite.png`,
    },
    description: "",
    fullName: () => {
      return `${this.firstName} ${this.lastName}`;
    },
    nickname: {
      [CONFIG.player.fabrissazzo]: "Ciccio Cozza",
      [CONFIG.player.gianni]: "Cozzarini",
    },
  },
};
