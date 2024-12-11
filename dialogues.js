const NPC_DIALOGUES = {
  [MAP_IDS.intro]: {
    [NPC_IDS.cozza]: {
      start: {
        id: "start",
        textVariants: {
          [CONFIG.player.gianni]: {
            text: "Salve prof...",
            next: "gianni_answer",
          },
          [CONFIG.player.fabrissazzo]: {
            text: "Ciao Ruben, ho qui er mazzo da briscola. Briscolata?",
            next: "fabris_answer",
          },
        },
        conditions: [],
      },
      gianni_answer: {
        id: "gianni_answer",
        speaker: CONFIG.player.gianni,
        choices: [
          {
            text: "Cozzarini! Stai zitto",
            next: "goodbye",
          },
          {
            text: "Ti metto 2",
            next: "goodbye",
          },
        ],
        next: "goodbye",
      },
      fabris_answer: {
        id: "fabris_answer",
        text: "Si dai",
        speaker: CONFIG.player.fabrissazzo,
        conditions: [],
        events: [],
        next: "fabris_2",
      },
      fabris_2: {
        id: "fabris_2",
        text: "...",
        speaker: CONFIG.player.fabrissazzo,
        conditions: [],
        events: [],
        next: "fabris_3",
      },
      fabris_3: {
        id: "fabris_3",
        text: "Fanculo Cozza, a monte!",
        speaker: CONFIG.player.fabrissazzo,
        conditions: [],
        events: [],
        next: null,
      },
      goodbye: {
        id: "goodbye",
        text: "(sta sempre incazzato sto qua)",
        conditions: [],
        next: null,
      },
    },
    [NPC_IDS.furlanetto]: {
      start: {
        id: "start",
        text: "Ma che ooooooooh",
        speaker: CONFIG.player.gianni,
        conditions: [],
        events: [],
        next: "fabris",
      },
      fabris: {
        id: "fabris",
        choices: [
          {
            text: "Calmati Gianni! Non cedere alle sue provocazioni, sono dei maledetti!",
            next: "battle",
          },
          {
            text: "Mi metto 2",
            next: "battle",
          },
        ],
        speaker: CONFIG.player.fabrissazzo,
        conditions: [],
        events: [],
        next: "battle",
      },
      battle: {
        id: "battle",
        text: "Combattiamo!",
        conditions: [],
        next: null,
        battleId: "firstBattle",
      },
    },
  },
};

const MAP_OBJECT_DIALOGUES = {
  intro: {
    [MAP_OBJECT_IDS.fiorellino]: {
      start: {
        id: "start",
        text: "Guarda Gianni, un fiorazzo",
        speaker: CONFIG.player.fabrissazzo,
        conditions: [],
        events: [],
        next: "gianni",
      },
      gianni: {
        id: "gianni",
        text: "Fabris... quanti petali ha quel fiore? Il tuo voto dipende da questo",
        speaker: CONFIG.player.gianni,
        conditions: [],
        events: [],
        next: "fabris",
      },
      fabris: {
        id: "fabris",
        text: "8 prof, hehehe",
        speaker: CONFIG.player.fabrissazzo,
        conditions: [],
        events: [],
        next: "fine",
      },
      fine: {
        id: "fine",
        text: "BENE! Quindi 10-8 fa 2!",
        speaker: CONFIG.player.gianni,
        conditions: [],
        events: [],
        next: null,
      },
    },
  },
};
