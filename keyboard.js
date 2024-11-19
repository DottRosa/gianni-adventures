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

  // This is a unique ID that identifies a key press. It is based on the timestamp,
  // so pressing the same key multiple times in a row will generate different codes.
  // This ID is useful for blocking player actions if they hold down a key.
  // If the ID remains the same, it means the key is being held down.
  keyId = null;

  registerKeyPressed(keyboardEvent) {
    if (this.keyIsAlreadyPressed(keyboardEvent)) {
      return;
    }
    this.toggleKeyPressed(keyboardEvent, true);
    this.keyId = Date.now().toString(36);
  }

  unsetKeyPressed(keyboardEvent) {
    this.toggleKeyPressed(keyboardEvent, false);
  }

  keyIsAlreadyPressed(keyboardEvent) {
    const key = keyboardEvent.key.toLowerCase();

    switch (key) {
      case CONFIG.keyboard.switchKey: {
        return this.keysPressed.Switch;
      }
      case CONFIG.keyboard.interactKey: {
        return this.keysPressed.Interact;
      }
    }

    return this.keysPressed[keyboardEvent.key];
  }

  toggleKeyPressed(keyboardEvent, pressed) {
    const key = keyboardEvent.key.toLowerCase();

    switch (key) {
      case CONFIG.keyboard.switchKey: {
        this.keysPressed.Switch = pressed;
        return;
      }
      case CONFIG.keyboard.interactKey: {
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

  unsetInteract() {
    this.keysPressed.Interact = false;
  }
}
