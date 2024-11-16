class Keyboard {
  keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
    Enter: false,
    Switch: false,
  };

  registerKeyPressed(keyboardEvent) {
    if (keyboardEvent.key.toLowerCase() === KEYBOARD_SWITCH_KEY) {
      this.keysPressed.Switch = true;
    } else {
      this.keysPressed[keyboardEvent.key] = true;
    }
  }

  unsetKeyPressed(keyboardEvent) {
    if (keyboardEvent.key.toLowerCase() === KEYBOARD_SWITCH_KEY) {
      this.keysPressed.Switch = false;
    } else {
      this.keysPressed[keyboardEvent.key] = false;
    }
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

  get isEnter() {
    return this.keysPressed.Enter;
  }

  get isSwitch() {
    return this.keysPressed.Switch;
  }

  unsetSwitch() {
    this.keysPressed.Switch = false;
  }
}
