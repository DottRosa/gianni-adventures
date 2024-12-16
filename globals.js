const GLOBALS = {
  dialogue: {
    entity: null,
    inProgress: false,
  },
  players: {},
  partnerDrift: { x: 0, y: 0 },
  keyboard: null,
  interactionCooldown: 0,
  lastKeyPressedId: null,
};

GLOBALS.players[CONFIG.player.fabrissazzo] = new Player({
  spriteImages: {
    left: `${CONFIG.assets.folder}/fabris-sprite-left.png`,
    right: `${CONFIG.assets.folder}/fabris-sprite-right.png`,
  },
  name: "Fabris",
  characterBattleStats: new CharacterBattleStats({
    health: 100,
    stamina: 5,
    velocity: 3,
  }),
  attacks: ATTACKS[CONFIG.player.fabrissazzo],
});

GLOBALS.players[CONFIG.player.gianni] = new Player({
  spriteImages: {
    left: `${CONFIG.assets.folder}/gianni-sprite-left.png`,
    right: `${CONFIG.assets.folder}/gianni-sprite-right.png`,
  },
  name: "Gianni",
  characterBattleStats: new CharacterBattleStats({
    health: 130,
    stamina: 4,
    velocity: 1,
  }),
  attacks: ATTACKS[CONFIG.player.gianni],
});
