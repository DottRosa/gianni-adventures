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
    text: "Ma che ooooooh!",
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

  draw({ position, name, players, partnerDrift }) {
    const boxHeight = 60;

    // when the npc is speaking
    let boxX = position.x + 20;
    let boxY = position.y - boxHeight;
    let entityName = name;

    // when a player is speaking
    if (this.currentDialogue.speaker) {
      const player = players[this.currentDialogue.speaker];

      if (this.currentDialogue.speaker === mainPlayer) {
        boxX = player.position.x + 20;
        boxY = player.position.y - boxHeight;
      } else {
        boxX = player.position.x + 20 + partnerDrift.x;
        boxY = player.position.y - boxHeight + partnerDrift.y;
      }

      entityName = player.name;
    }

    ctx.fillStyle = NPC_DIALOGUE_BALLOON_COLOR;
    ctx.fillRect(boxX, boxY, 100, boxHeight);

    ctx.strokeStyle = NPC_DIALOGUE_BALLOON_BORDER_COLOR;
    ctx.strokeRect(boxX, boxY, 100, boxHeight);

    ctx.textAlign = "left";
    ctx.font = NPC_DIALOGUE_FONT_BOLD;
    ctx.fillStyle = NPC_DIALOGUE_NAME_COLOR;
    ctx.fillText(entityName, boxX + 5, boxY + 5, boxY + boxHeight / 2);

    ctx.font = NPC_DIALOGUE_FONT_NORMAL;
    ctx.fillStyle = NPC_DIALOGUE_TEXT_COLOR;

    ctx.fillText(
      this.currentDialogText,
      boxX + 5,
      boxY + 20,
      boxY + boxHeight / 2
    );
  }
}

const dialogueManager = new DialogueManager(dialogues);
