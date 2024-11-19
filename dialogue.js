const dialogues = {
  intro: {
    id: "intro",
    textVariants: {
      gianni: {
        text: "Ciao Gianni!",
        next: "gianni_answer",
      },
      fabrissazzo: {
        text: "Fabris...",
        next: "fabris_answer",
      },
    },
    conditions: [],
  },
  gianni_answer: {
    id: "gianni_answer",
    speaker: PLAYER_GIANNI,
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
    speaker: PLAYER_FABRISSAZZO,
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
    speaker: PLAYER_GIANNI,
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
};

class DialogueManager {
  choiceInProgress = false;
  currentChoices = null;
  currentChoice = -1;

  constructor(dialogues) {
    this.dialogues = dialogues;
    this.currentDialogue = null;
    this.state = {};
  }

  start(dialogueId) {
    let dialogue = this.dialogues.intro;
    if (!dialogue) {
      console.error('"intro" dialogue missing');
    }

    if (dialogueId) {
      dialogue = this.dialogues[dialogueId];
    }

    if (!dialogue) {
      return null;
    }

    if (dialogue.textVariants) {
      const variant = dialogue.textVariants[mainPlayer];
      if (variant) {
        this.currentDialogue = dialogue;
      }
    }

    this.currentDialogue = dialogue;
  }

  next() {
    let nextId = this.currentDialogue.next;
    if (this.currentDialogue.textVariants) {
      const variant = this.currentDialogue.textVariants[mainPlayer];
      nextId = variant.next;
    }

    if (!nextId) {
      return false;
    }

    this.start(nextId);
    return true;
  }

  get ended() {
    return !this.currentDialogue.next;
  }

  get currentDialogText() {
    if (this.currentDialogue.textVariants) {
      const variant = this.currentDialogue.textVariants[mainPlayer];
      return variant.text;
    }

    return this.currentDialogue.text;
  }

  nextChoice() {
    this.currentChoice++;
    if (this.currentChoice >= this.currentChoices.length) {
      this.currentChoice = 0;
    }
  }

  previousChoice() {
    this.currentChoice--;
    if (this.currentChoice < 0) {
      this.currentChoice = this.currentChoices.length - 1;
    }
  }

  selectChoice() {
    let nextId = this.currentDialogue.choices[this.currentChoice].next;
    this.currentChoice = -1;
    this.choiceInProgress = false;

    if (!nextId) {
      return false;
    }

    this.start(nextId);
    return true;
  }

  draw({ position, name, players, partnerDrift }) {
    // when the npc is speaking
    let boxX = position.x + 20;
    let boxY = position.y - CONFIG.dialogue.balloon.height;
    let entityName = name;

    // when a player is speaking
    if (this.currentDialogue.speaker) {
      const player = players[this.currentDialogue.speaker];

      if (this.currentDialogue.speaker === mainPlayer) {
        boxX = player.position.x + 20;
        boxY = player.position.y - CONFIG.dialogue.balloon.height;
      } else {
        boxX = player.position.x + 20 + partnerDrift.x;
        boxY =
          player.position.y - CONFIG.dialogue.balloon.height + partnerDrift.y;
      }

      entityName = player.name;
    }

    ctx.fillStyle = CONFIG.dialogue.balloon.backgroundColor;
    ctx.fillRect(
      boxX,
      boxY,
      CONFIG.dialogue.balloon.width,
      CONFIG.dialogue.balloon.height
    );

    ctx.strokeStyle = CONFIG.dialogue.balloon.borderColor;
    ctx.strokeRect(
      boxX,
      boxY,
      CONFIG.dialogue.balloon.width,
      CONFIG.dialogue.balloon.height
    );

    ctx.textAlign = CONFIG.dialogue.textAlign;
    ctx.font = CONFIG.dialogue.fontBold;
    ctx.fillStyle = CONFIG.dialogue.nameColor;
    ctx.fillText(
      entityName,
      boxX + 5,
      boxY + 5,
      boxY + CONFIG.dialogue.balloon.height / 2
    );

    ctx.font = CONFIG.dialogue.fontNormal;
    ctx.fillStyle = CONFIG.dialogue.textColor;

    if (this.currentDialogue.choices) {
      if (!this.choiceInProgress) {
        this.choiceInProgress = true;
        this.currentChoices = this.currentDialogue.choices;
        this.currentChoice = 0;
      }
      this.currentDialogue.choices.forEach((choice, index) => {
        const prefix = this.currentChoice === index ? "> " : "";
        ctx.fillText(
          `${prefix}${choice.text}`,
          boxX + (prefix ? 5 : 15),
          boxY + 20 + index * 15,
          boxY + CONFIG.dialogue.balloon.height / 2 + index * 15
        );
      });
    } else {
      ctx.fillText(
        this.currentDialogText,
        boxX + 5,
        boxY + 20,
        boxY + CONFIG.dialogue.balloon.height / 2
      );
    }
  }
}

const dialogueManager = new DialogueManager(dialogues);
