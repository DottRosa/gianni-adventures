const NPCS = {
  [MAP_IDS.intro]: {
    [NPC_IDS.furlanetto]: new NPC({
      details: BESTIARY[NPC_IDS.furlanetto],
      mapPositionCell: {
        cellX: 17,
        cellY: 22,
      },
      dialogueManager: new DialogueManager(
        NPC_DIALOGUES.intro[NPC_IDS.furlanetto]
      ),
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
        cellX: 36,
        cellY: 17,
      },
      dialogueManager: new DialogueManager(NPC_DIALOGUES.intro[NPC_IDS.cozza]),
      characterBattleStats: new CharacterBattleStats({
        health: 120,
        stamina: 4,
        velocity: 2,
      }),
      attacks: ATTACKS[[NPC_IDS.cozza]],
    }),
  },
};
