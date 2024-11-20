const DIALOGUES = {
  intro: {
    [NPCS_KEYS.cozza]: {
      start: {
        id: "start",
        textVariants: {
          [CONFIG.player.gianni]: {
            text: "Salve prof...",
            next: "gianni_answer",
          },
          [CONFIG.player.fabrissazzo]: {
            text: "Ciao Ruben, briscolata?",
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
    [NPCS_KEYS.furlanetto]: {
      start: {
        id: "start",
        textVariants: {
          [CONFIG.player.gianni]: {
            text: "Ciao Gianni!",
            next: "gianni_answer",
          },
          [CONFIG.player.fabrissazzo]: {
            text: "Fabris...",
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
            text: "Ma che ooooooh!",
            next: "goodbye",
          },
          {
            text: "Allora ooooh!",
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
        text: "mmm...",
        speaker: CONFIG.player.fabrissazzo,
        conditions: [],
        events: [],
        next: "fabris_2",
      },
      fabris_2: {
        id: "fabris_2",
        text: "Fai ridere...",
        conditions: [],
        events: [],
        next: "gianni_finish",
      },
      gianni_finish: {
        id: "gianni_finish",
        text: "Ha ragione Fabris!",
        speaker: CONFIG.player.gianni,
        conditions: [],
        events: [],
        next: null,
      },
      goodbye: {
        id: "goodbye",
        text: "Okok non serve incazzarsi!",
        conditions: [],
        next: null,
      },
    },
  },
};
