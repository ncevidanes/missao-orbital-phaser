import {
  shouldShowTouchControls,
  TouchDirectionState,
} from '../systems/TouchDirectionState.js';

const DIRECTION_BUTTONS = [
  { direction: 'up', x: 0, y: -70, label: '▲' },
  { direction: 'left', x: -70, y: 0, label: '◀' },
  { direction: 'down', x: 0, y: 70, label: '▼' },
  { direction: 'right', x: 70, y: 0, label: '▶' },
];

function detectTouchCapability() {
  return shouldShowTouchControls({
    maxTouchPoints: globalThis.navigator?.maxTouchPoints ?? 0,
    coarsePointer: globalThis.matchMedia?.('(pointer: coarse)').matches ?? false,
  });
}

export class TouchControls {
  constructor(scene, { onMenu, forceVisible } = {}) {
    this.scene = scene;
    this.directionState = new TouchDirectionState();
    this.visible = forceVisible ?? detectTouchCapability();
    this.directionButtons = new Map();
    this.root = scene.add.container(0, 0).setDepth(80).setVisible(this.visible);
    this.releaseAll = () => {
      this.directionState.clear();
      this.syncButtonVisuals();
    };

    if (!this.visible) {
      scene.events.once('shutdown', this.destroy, this);
      return;
    }

    this.createDirectionalPad();
    this.createMenuButton(onMenu);

    this.releasePointer = (pointer) => {
      this.directionState.release(pointer.id);
      this.syncButtonVisuals();
    };

    scene.input.on('pointerup', this.releasePointer);
    scene.input.on('gameout', this.releaseAll);
    scene.events.once('shutdown', this.destroy, this);
  }

  createDirectionalPad() {
    const { height } = this.scene.scale;
    const centerX = 122;
    const centerY = height - 134;
    const base = this.scene.add.circle(centerX, centerY, 108, 0x031003, 0.68)
      .setStrokeStyle(2, 0x17843b, 0.58);
    const center = this.scene.add.circle(centerX, centerY, 23, 0x39ff70, 0.12)
      .setStrokeStyle(1, 0x39ff70, 0.42);

    this.root.add([base, center]);

    DIRECTION_BUTTONS.forEach(({ direction, x, y, label }) => {
      const button = this.scene.add.circle(
        centerX + x,
        centerY + y,
        38,
        0x061d0b,
        0.88,
      )
        .setStrokeStyle(2, 0x39ff70, 0.72)
        .setInteractive({ useHandCursor: true });
      const arrow = this.scene.add.text(centerX + x, centerY + y - 1, label, {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '30px',
        fontStyle: 'bold',
        color: '#b8ffca',
      }).setOrigin(0.5);

      const press = (pointer) => {
        this.directionState.press(direction, pointer.id);
        this.syncButtonVisuals();
      };
      const release = (pointer) => {
        this.directionState.release(pointer.id);
        this.syncButtonVisuals();
      };

      button
        .on('pointerdown', press)
        .on('pointerover', (pointer) => {
          if (pointer.isDown) {
            press(pointer);
          }
        })
        .on('pointerout', release);

      this.directionButtons.set(direction, button);
      this.root.add([button, arrow]);
    });
  }

  createMenuButton(onMenu) {
    const { width, height } = this.scene.scale;
    const x = width - 92;
    const y = height - 64;
    const background = this.scene.add.rectangle(x, y, 150, 68, 0x061d0b, 0.9)
      .setStrokeStyle(2, 0x39ff70, 0.7)
      .setInteractive({ useHandCursor: true });
    const label = this.scene.add.text(x, y, 'MENU', {
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '21px',
      fontStyle: 'bold',
      color: '#b8ffca',
    }).setOrigin(0.5);

    background
      .on('pointerdown', () => {
        background.setFillStyle(0x17843b, 0.96);
        onMenu?.();
      })
      .on('pointerup', () => background.setFillStyle(0x061d0b, 0.9))
      .on('pointerout', () => background.setFillStyle(0x061d0b, 0.9));

    this.root.add([background, label]);
  }

  getMovement() {
    return this.directionState.snapshot();
  }

  setVisible(visible) {
    this.releaseAll();
    this.root.setVisible(this.visible && visible);
  }

  syncButtonVisuals() {
    this.directionButtons.forEach((button, direction) => {
      const active = this.directionState.isPressed(direction);
      button
        .setFillStyle(active ? 0x17843b : 0x061d0b, active ? 0.98 : 0.88)
        .setScale(active ? 0.92 : 1);
    });
  }

  destroy() {
    if (this.releasePointer) {
      this.scene.input.off('pointerup', this.releasePointer);
      this.scene.input.off('gameout', this.releaseAll);
    }
    this.directionState.clear();
    this.root.destroy(true);
  }
}
