const KEYBOARD_SWITCH_KEY = "s";
const KEYBOARD_INTERACT_KEY = "a";

class Keyboard {
  keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
    Enter: false,
    Switch: false,
    Interact: false,
  };

  registerKeyPressed(keyboardEvent) {
    this.toggleKeyPressed(keyboardEvent, true);
  }

  unsetKeyPressed(keyboardEvent) {
    this.toggleKeyPressed(keyboardEvent, false);
  }

  toggleKeyPressed(keyboardEvent, pressed) {
    const key = keyboardEvent.key.toLowerCase();

    switch (key) {
      case KEYBOARD_SWITCH_KEY: {
        this.keysPressed.Switch = pressed;
        return;
      }
      case KEYBOARD_INTERACT_KEY: {
        this.keysPressed.Interact = pressed;
        return;
      }
    }

    this.keysPressed[keyboardEvent.key] = pressed;
  }

  get isUp() {
    return this.keysPressed.ArrowUp;
  }

  get isDown() {
    return this.keysPressed.ArrowDown;
  }

  get isLeft() {
    return this.keysPressed.ArrowLeft;
  }

  get isRight() {
    return this.keysPressed.ArrowRight;
  }

  get oneMovementKeyIsPressed() {
    const trueCount = Object.values(this.keysPressed).filter(
      (value) => value === true
    ).length;
    return trueCount === 1;
  }

  get isEnter() {
    return this.keysPressed.Enter;
  }

  get isSwitch() {
    return this.keysPressed.Switch;
  }

  get isInteract() {
    return this.keysPressed.Interact;
  }

  unsetSwitch() {
    this.keysPressed.Switch = false;
  }
}
