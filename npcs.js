const NPCS = {
  // buoni
  [NPC_IDS.furlanetto]: new NPC({
    details: BESTIARY[NPC_IDS.furlanetto],
    mapPositionCell: {
      [MAP_IDS.intro]: {
        cellX: 17,
        cellY: 22,
      },
    },
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.furlanetto],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 6,
      velocity: 3,
    }),
    attacks: ATTACKS[[NPC_IDS.furlanetto]],
  }),
  [NPC_IDS.cozza]: new NPC({
    details: BESTIARY[NPC_IDS.cozza],
    mapPositionCell: {
      [MAP_IDS.intro]: {
        cellX: 19,
        cellY: 21,
      },
    },
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.cozza],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.cozza]],
  }),
  [NPC_IDS.tumus]: new NPC({
    details: BESTIARY[NPC_IDS.tumus],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.tartaglione]: new NPC({
    details: BESTIARY[NPC_IDS.tartaglione],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.simonato]: new NPC({
    details: BESTIARY[NPC_IDS.simonato],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.rosa]: new NPC({
    details: BESTIARY[NPC_IDS.rosa],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.cristante]: new NPC({
    details: BESTIARY[NPC_IDS.cristante],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.ceccobelli]: new NPC({
    details: BESTIARY[NPC_IDS.ceccobelli],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.denis]: new NPC({
    details: BESTIARY[NPC_IDS.denis],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.pisani]: new NPC({
    details: BESTIARY[NPC_IDS.pisani],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.selva]: new NPC({
    details: BESTIARY[NPC_IDS.selva],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.tramontin]: new NPC({
    details: BESTIARY[NPC_IDS.tramontin],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.depol]: new NPC({
    details: BESTIARY[NPC_IDS.depol],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.carrellino]: new NPC({
    details: BESTIARY[NPC_IDS.carrellino],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.maiullari]: new NPC({
    details: BESTIARY[NPC_IDS.maiullari],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.preside]: new NPC({
    details: BESTIARY[NPC_IDS.preside],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),

  // cattivi
  [NPC_IDS.crosilla]: new NPC({
    details: BESTIARY[NPC_IDS.crosilla],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.sbriz]: new NPC({
    details: BESTIARY[NPC_IDS.sbriz],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.tesolin]: new NPC({
    details: BESTIARY[NPC_IDS.tesolin],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.villalta]: new NPC({
    details: BESTIARY[NPC_IDS.villalta],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.librincomodato]: new NPC({
    details: BESTIARY[NPC_IDS.librincomodato],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.eliana]: new NPC({
    details: BESTIARY[NPC_IDS.eliana],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.smithers]: new NPC({
    details: BESTIARY[NPC_IDS.smithers],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.pilot]: new NPC({
    details: BESTIARY[NPC_IDS.pilot],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.colussi]: new NPC({
    details: BESTIARY[NPC_IDS.colussi],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),
  [NPC_IDS.forte]: new NPC({
    details: BESTIARY[NPC_IDS.forte],
    mapPositionCell: {},
    dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
    characterBattleStats: new CharacterBattleStats({
      health: 120,
      stamina: 4,
      velocity: 2,
    }),
    attacks: ATTACKS[[NPC_IDS.tumus]],
  }),

  // di supporto (da non usare come npc)
  blurred: new NPC({
    details: {
      firstName: "",
      lastName: "",
      spriteImages: {
        left: `${CONFIG.assets.folder}/blurred-sprite.png`,
        right: `${CONFIG.assets.folder}/blurred-sprite.png`,
      },
      description: "",
      nickname: {
        [CONFIG.player.fabrissazzo]: "",
        [CONFIG.player.gianni]: "",
      },
    },
  }),
};
