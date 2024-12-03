class StatusEffect {
  currentFrame = 0;

  constructor({ id, icon, name, description, gif }) {
    this.id = id;
    this.icon = icon;
    this.name = name;
    this.description = description;
    this.gif = gif;
    if (!gif) {
      this.gif = GIFS[GIF_IDS.aura];
    }
  }

  draw(x, y) {
    this.gif.animate(x, y);
  }
}

const STATUS_EFFECTS = {
  // negative
  blindness: new StatusEffect({
    id: "blindness",
    icon: "",
    name: "Cecità",
    description: "Chi ne è afflitto potrebbe non attaccare",
    gif: GIFS[GIF_IDS.aura],
  }),
  debilitation: new StatusEffect({
    id: "debilitation",
    icon: "",
    name: "Debilitazione",
    description: "Il danno del prossimo attacco viene ridotto del 50%",
  }),
  // positive
  concentrated: new StatusEffect({
    id: "concentrated",
    icon: "",
    name: "Concentrato",
    description: "Qualunque attacco va a segno al 100%",
  }),
  regeneration: new StatusEffect({
    id: "regeneration",
    icon: "",
    name: "Rigenerazione",
    description: "Recupera il 10% della vita totale ogni turno",
  }),
};
