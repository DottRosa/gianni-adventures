// class Dialogue {
//   currentDialog = 0;
//   ended = false;

//   constructor({ textBlocks = [] }) {
//     this.textBlocks = textBlocks;
//   }

//   next() {
//     this.currentDialog++;

//     if (this.currentDialog >= this.textBlocks.length) {
//       this.currentDialog = 0;
//       this.ended = true;
//     }
//   }

//   get text() {
//     return this.textBlocks[this.currentDialog];
//   }
// }

// const textBlocks = [
//   {
//     sentence: "Ciao Gianni",
//     player: PLAYER_GIANNI,
//   },
// ];

const dialogues = {
  intro: {
    id: "intro",
    textVariants: {
      gianni: {
        text: "Ciao Gianni!",
        next: "gianni_question",
      },
      fabrissazzo: {
        text: "Fabris...",
        next: "fabris",
      },
    },
    conditions: [],
  },
  gianni_question: {
    id: "gianni_question",
    text: "Come posso aiutarti?",
    next: "goodbye",
  },
  fabris: {
    id: "fabris",
    text: "Fai ridere...",
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

  draw(position, name) {
    const boxHeight = 60;
    const boxX = position.x + 20;
    const boxY = position.y - boxHeight;

    ctx.fillStyle = NPC_DIALOGUE_BALLOON_COLOR;
    ctx.fillRect(boxX, boxY, 100, boxHeight);

    ctx.strokeStyle = NPC_DIALOGUE_BALLOON_BORDER_COLOR;
    ctx.strokeRect(boxX, boxY, 100, boxHeight);

    ctx.textAlign = "left";
    ctx.font = NPC_DIALOGUE_FONT_BOLD;
    ctx.fillStyle = NPC_DIALOGUE_NAME_COLOR;
    ctx.fillText(name, boxX + 5, boxY + 5, boxY + boxHeight / 2);

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
