const NPCS = {
  [MAP_IDS.intro]: {
    [NPC_IDS.furlanetto]: new NPC({
      details: BESTIARY[NPC_IDS.furlanetto],
      mapPositionCell: {
        cellX: 17,
        cellY: 22,
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
        cellX: 19,
        cellY: 21,
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
      mapPositionCell: {
        cellX: 36,
        cellY: 17,
      },
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
      mapPositionCell: {
        cellX: 36,
        cellY: 17,
      },
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
      mapPositionCell: {
        cellX: 36,
        cellY: 17,
      },
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
      mapPositionCell: {
        cellX: 36,
        cellY: 17,
      },
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
      mapPositionCell: {
        cellX: 36,
        cellY: 17,
      },
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
      mapPositionCell: {
        cellX: 36,
        cellY: 17,
      },
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
      mapPositionCell: {
        cellX: 36,
        cellY: 17,
      },
      dialogues: NPC_DIALOGUES.intro[NPC_IDS.tumus],
      characterBattleStats: new CharacterBattleStats({
        health: 120,
        stamina: 4,
        velocity: 2,
      }),
      attacks: ATTACKS[[NPC_IDS.tumus]],
    }),
  },
};
