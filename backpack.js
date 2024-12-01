class Backpack {
  constructor() {
    this.items = {}; // Mappa degli ID degli oggetti ai dettagli e conteggio
  }

  addItem(item) {
    if (!this.items[item.id]) {
      this.items[item.id] = { ...item, quantity: 0 };
    }
    this.items[item.id].quantity += 1;
  }

  removeItem(itemId) {
    if (this.items[itemId]) {
      this.items[itemId].quantity -= 1;
      if (this.items[itemId].quantity <= 0) {
        delete this.items[itemId];
      }
    }
  }

  getItemDetails(itemId) {
    return this.items[itemId] || null; // Dettagli dell'oggetto o null
  }

  get itemsList() {
    return Object.values(this.items).map(
      ({ id, name, quantity, description, icon, attack }) => ({
        id,
        name,
        quantity,
        description,
        icon,
        attack,
      })
    );
  }
}

class Item {
  constructor({ name, description, icon, attack }) {
    this.id = name.toLowerCase().replace(/ /g, "-"); // Converte spazi in trattini
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.attack = attack;
  }
}

const backpack = new Backpack();

const potion = new Item({
  name: "Healing Potion",
  description: "Restores 50 HP",
  icon: "potion-icon.png",
  attack: ATTACKS.fabrissazzo[2],
});

const elixir = new Item({
  name: "Magic Elixir",
  description: "Restores 50 MP",
  icon: "elixir-icon.png",
});

backpack.addItem(potion);
backpack.addItem(elixir);

console.log(backpack);
