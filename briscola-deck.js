const BRISCOLA_SEEDS = {
  coppe: "coppe",
  denari: "denari",
  spade: "spade",
  bastoni: "bastoni",
};

class BriscolaCard {
  constructor({ seed, number }) {
    this.seed = seed;
    this.number = number;
  }

  /**
   * Ritorna true se è il 3
   */
  get isGna() {
    return this.number === 3;
  }

  /**
   * Ritorna true se è il fante
   */
  get isFante() {
    return this.number === 8;
  }

  /**
   * Ritorna true se è il cavallo
   */
  get isCavallo() {
    return this.number === 9;
  }

  /**
   * Ritorna true se è il re
   */
  get isRe() {
    return this.number === 10;
  }

  /**
   * Ritorna true se è l'asso
   */
  get isMu() {
    return this.number === 1;
  }
}

class BriscolaDeck {
  cards = [];

  constructor() {
    Object.keys(BRISCOLA_SEEDS).forEach((key) => {
      for (var i = 1; i <= 10; i++) {
        this.cards.push(
          new BriscolaCard({ seed: BRISCOLA_SEEDS[key], number: i })
        );
      }
    });
    this.shuffle();
  }

  // Metodo per mescolare all'americana (riffle shuffle)
  riffleShuffle() {
    let half1 = this.cards.slice(0, Math.floor(this.cards.length / 2));
    let half2 = this.cards.slice(Math.floor(this.cards.length / 2));
    let shuffledDeck = [];

    while (half1.length || half2.length) {
      if (half1.length && Math.random() > 0.5) {
        shuffledDeck.push(half1.shift());
      }
      if (half2.length) {
        shuffledDeck.push(half2.shift());
      }
    }

    this.cards = shuffledDeck;
  }

  // Metodo per mescolare all'italiana (mazzetti casuali)
  italianShuffle() {
    let portions = [];
    let remainingCards = [...this.cards];

    while (remainingCards.length > 0) {
      let portionSize = Math.floor(Math.random() * 5) + 1; // Dimensione tra 1 e 5
      portions.push(remainingCards.splice(0, portionSize));
    }

    // Ricomponi i mazzetti in ordine casuale
    this.cards = portions.sort(() => Math.random() - 0.5).flat();
  }

  // Metodo principale di mescolamento che alterna i due tipi
  shuffle() {
    for (let i = 0; i < 3; i++) {
      this.riffleShuffle();
      this.italianShuffle();
    }
  }
}
