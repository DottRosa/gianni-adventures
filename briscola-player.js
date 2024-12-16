const BRISCOLA_PLAYER_DEFAULT_STATS = {
  muExecution: 0.5, // probabilità di fare mu quando viene effettivamente pescato
  muPower: 1, // indica il potere del Mu. Se 1 il potere rimane quello di default

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

class BriscolaPlayer {
  constructor({ character, pros = [], cons = [], stats = {} }) {
    this.character = character;
    this.pros = pros;
    this.cons = cons;
    this.stats = { ...BRISCOLA_PLAYER_DEFAULT_STATS, ...stats };
  }
}

const BRISCOLA_PLAYERS = {
  cozza: new BriscolaPlayer({
    character: NPCS[MAP_IDS.intro].cozza,
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
  }),
  tumus: new BriscolaPlayer({
    character: NPCS[MAP_IDS.intro].tumus,
    pros: [
      {
        title: "Birbante",
        description:
          "Sbircia spesso e ha maggiore probabilità farlo con successo",
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
  }),
  tartaglione: new BriscolaPlayer({
    character: NPCS[MAP_IDS.intro].tartaglione,
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
  }),
  simonato: new BriscolaPlayer({
    character: NPCS[MAP_IDS.intro].simonato,
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
  }),
  rosa: new BriscolaPlayer({
    character: NPCS[MAP_IDS.intro].rosa,
    pros: [
      {
        title: "Profittevole",
        description:
          "Dopo l’incitamento di carica, se il piglio va a buon fine, il Morale aumenta molto",
      },
      {
        title: "Compagno fidato",
        description: "Esegue motti comprensibili",
      },
    ],
    cons: [
      {
        title: "Spericolato",
        description: "Incita a caricare anche con briscole molto basse",
      },
    ],
  }),
  furlanetto: new BriscolaPlayer({
    character: NPCS[MAP_IDS.intro].furlanetto,
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
        description: "Non fa motti, non fa Mu, non fa pesca con rivelazione",
      },
    ],
  }),
  cristante: new BriscolaPlayer({
    character: NPCS[MAP_IDS.intro].cristante,
    pros: [
      {
        title: "Professionista",
        description:
          "Quando incita la carica, il piglio verrà sicuramente portato a casa",
      },
    ],
    cons: [
      {
        title: "Onesto",
        description: "Non sbircia mai",
      },
    ],
  }),
  ceccobelli: new BriscolaPlayer({
    character: NPCS[MAP_IDS.intro].denis,
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
  }),
};
