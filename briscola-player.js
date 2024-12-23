const BRISCOLA_PLAYER_DEFAULT_STATS = {
  muExecution: 0.5, // probabilità di fare mu quando viene effettivamente pescato
  muPower: 0, // indica il potere del Mu. Se 0 il potere rimane quello di default

  revelationDrawExecution: 0.2, // probabilità di fare pesca con rivelazione ad ogni pescata

  loadExecution: 0.5, // probabilità di incitare la carica ad ogni turno (quando possibile)

  peekExecution: 0.2, // probabilità di sbirciare ad ogni turno
  peekAbility: 0.5, // probabilità nel riuscire a sbriciare

  sendUpInSmoke: 0.2, // probabilità di mandare a monte

  mottoExecution: 0.5, // probabilità che un npc esegua il motto (quando necessario)
  mottoPrecision: 0.5, // indica la precisione e quindi la comprensione (da parte del partner) dei motti

  moraleBoost: 0, // indica l'aumento di morale quando questo viene triggherato. Se 0, non c'è aumento oltre a quello standard
  moraleDrop: 0, // indica il decremento di morale quando questo viene triggherato. Se 0, non c'è diminuzione oltre a quello standard
};

const BRISCOLA_PLAYER_DEFAULT_STATS_LABELS = {
  muExecution: "Probabilità di fare Mu",
  muPower: "Potere del Mu",
  revelationDrawExecution: "Probabilità di eseguire pesca con rivelazione",
  loadExecution: "Probabilità di incitare la carica",
  peekExecution: "Probabilità di eseguire la sbriciata",
  peekAbility: "Probabilità di sbirciare con successo",
  sendUpInSmoke: "Probabilità di mandare a monte con Morale basso",
  mottoExecution: "Probabilità di esecuzione dei motti",
  mottoPrecision: "Precisione dei motti",
  moraleBoost: "Incremento di morale",
  moraleDrop: "Decremento di morale",
};

class BriscolaPlayer {
  constructor({
    character,
    pros = [],
    cons = [],
    stats = {},
    description = "",
    enableByEvent = null,
  }) {
    this.character = character;
    this.pros = pros;
    this.cons = cons;
    this.description = description;
    this.stats = { ...BRISCOLA_PLAYER_DEFAULT_STATS, ...stats };
    this.enableByEvent = enableByEvent;
  }

  isUnblocked() {
    if (this.enableByEvent === null) return true;
    return GAME_STATE.briscolaPlayer[this.enableByEvent];
  }

  getVisualStatValue(stat) {
    const value = Math.floor(this.stats[stat] * 100);

    switch (stat) {
      case "muPower":
      case "moraleBoost":
      case "moraleDrop": {
        return `${this.stats[stat] >= 0 ? "+" : "-"}${value}%`;
      }
      case "muExecution":
      case "revelationDrawExecution":
      case "loadExecution":
      case "peekExecution":
      case "sendUpInSmoke":
      case "mottoExecution":
      case "mottoPrecision":
      case "peekAbility": {
        return `${value}%`;
      }
    }
  }
}

const BRISCOLA_PLAYERS = {
  cozza: new BriscolaPlayer({
    character: NPCS.cozza,
    pros: [
      {
        title: "Sicurezza matematica",
        description:
          "Conta i punti e ad ogni turno, se questi sono superiori a quelli avversari, guadagna Morale",
      },
      {
        title: "Vantaggio",
        description: "I punti di entrambe le squadre vengono visualizzati",
      },
    ],
    cons: [
      {
        title: "Nervoso",
        description: "Manda a monte facilmente",
      },
    ],
    stats: {
      sendUpInSmoke: 0.4,
    },
    description:
      "Giocatore abile che adotta svariate strategie pur di vincere, rispettando comunque le regole. Spesso le carte da lui giocate profumano di patatine delle macchinette.",
  }),
  tumus: new BriscolaPlayer({
    character: NPCS.tumus,
    pros: [
      {
        title: "Birbante",
        description:
          "Sbircia spesso e ha maggiore probabilità di farlo con successo",
      },
    ],
    cons: [
      {
        title: "Permaloso",
        description:
          "Se le sue carte vengono sbirciate, fa calare molto il Morale della squadra",
      },
    ],
    stats: {
      peekExecution: 0.6,
      peekAbility: 0.75,
    },
    description:
      "Giocatore contraddistinto dalla fortuna. Incita spesso coloro che reputa lenti a darsi una mossa, quando lui stesso ci mette piu tempo di chiunque altro. Usa frasi del tipo 'Allora ti muovi?'. Che fastidio.",
  }),
  gianni: new BriscolaPlayer({
    character: GLOBALS.players.gianni,
    pros: [
      {
        title: "Motivatore",
        description: "Ogni aumento di Morale è incrementato",
      },
    ],
    cons: [
      {
        title: "Vecchia scuola",
        description:
          "Non effettua mai pesca con rivelazione e non esegue mai Mu",
      },
    ],
    stats: {
      revelationDrawExecution: 0,
      muExecution: 0,
      moraleBoost: 0.2,
    },
    description:
      "Poco da dire, è Gianni. I suoi baffoni gli consentono di mantenere un'apparente faccia da poker. È un giocatore di vecchia data e non è affine ai metodi di gioco adottati dai giovani.",
  }),
  tartaglione: new BriscolaPlayer({
    character: NPCS.tartaglione,
    pros: [
      {
        title: "Faccia tosta",
        description: "Sbirciare le carte non fallisce mai",
      },
    ],
    cons: [
      {
        title: "Individualista",
        description: "Non fa mai motti e non incita mai la carica",
      },
    ],
    stats: {
      peekAbility: 1,
      mottoExecution: 0,
      loadExecution: 0,
    },
    description:
      "Un giocatore solitario, non comunica e non gioca di squadra. Pensa solo a se stesso. È tuttavia molto abile nel carpire informazioni dalla squadra avversaria.",
  }),
  simonato: new BriscolaPlayer({
    character: NPCS.simonato,
    pros: [
      {
        title: "Signore del MU",
        description: "Quando fa Mu, questo ha piu effetto",
      },
    ],
    cons: [
      {
        title: "Scommettitore",
        description: "Esegue molto spesso la pesca con rivelazione",
      },
    ],
    stats: {
      muPower: 1.5,
      revelationDrawExecution: 0.75,
    },
    description:
      "L'inventore del Mu, ne sforna uno nuovo ad ogni partita. Eccellente giocatore, ma pecca molto di presunzione e si fida troppo delle sue pescate.",
  }),
  rosa: new BriscolaPlayer({
    character: NPCS.rosa,
    pros: [
      {
        title: "Profittevole",
        description:
          "Dopo l’incitamento di carica, se il piglio va a buon fine, il Morale aumenta molto",
      },
      {
        title: "Compagno fidato",
        description: "I motti sono piu comprensibili del normale",
      },
    ],
    cons: [
      {
        title: "Spericolato",
        description:
          "Incita a caricare anche con briscole molto basse. Ha inoltre il 10% di probabilità di incitare la carica senza alcuna briscola.",
      },
    ],
    description:
      "Modestamente, un giocatore d'elite. È il tuo compagno di grandi avventure e quindi l'intesa è vincente. Ma anche io ho i miei difetti, e infatti rischio troppo.",
  }),
  furlanetto: new BriscolaPlayer({
    character: NPCS.furlanetto,
    pros: [
      {
        title: "Impassibile",
        description:
          "Quando le sue carte vengono sbriciate, non altera il Morale della squadra",
      },
      {
        title: "Statistico",
        description: "Mostra le briscole giocate durante tutta la partita",
      },
    ],
    cons: [
      {
        title: "Anacronistico",
        description: "Non fa motti, non fa Mu, non fa pesca con rivelazione.",
      },
    ],
    description:
      "Inutile ascoltare quello che ha da dire, la sua voce è troppo gutturale. Ha una faccia da poker invidiabile e non contempla le ragazzate tipo il Mu. Inoltre si vergogna di fare i motti.",
  }),
  cristante: new BriscolaPlayer({
    character: NPCS.cristante,
    pros: [
      {
        title: "Professionista",
        description:
          "Quando incita la carica sai che il piglio verrà sicuramente portato a casa.",
      },
      {
        title: "Maschio alfa",
        description:
          "Ad ogni turno, con una probabilità del 20%, intimidisce gli avversari, sbeffeggiandoli e fancendo calare il loro Morale",
      },
    ],
    cons: [
      {
        title: "Onesto",
        description: "Non sbircia mai",
      },
    ],
    cons: [
      {
        title: "Redarguire con sarcasmo",
        description:
          "Se giochi per penultimo/ultimo e gli avversari fanno un piglio sostanzioso, ti insulta ed il Morale cala.",
      },
    ],
    description:
      "Leggende narrano che abbia inventato lui la Briscola a 4. Il suo tallone d'Achille? Non manca di sbeffeggiare il suo stesso partner.",
  }),
  denis: new BriscolaPlayer({
    character: NPCS.denis,
    pros: [
      {
        title: "Labbra carnose",
        description: "Ogni motto che esegue è comprensibile al 100%",
      },
    ],
    cons: [
      {
        title: "Pessimista",
        description: "Qualunque calo di morale è incrementato",
      },
    ],
    stats: {
      mottoPrecision: 1,
      moraleDrop: 0.2,
    },
    description:
      "Un compagno leale e giusto. Grazie alle sua labbra carnose ogni motto è una certezza, tuttavia si abbatte facilmente e crede di più nella sfortuna che nella buona sorte.",
  }),
};
