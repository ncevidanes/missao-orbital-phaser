const GAME_ASPECT_RATIO = 16 / 9;

function positiveNumber(value, fallback) {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function resolveVisibleViewport({
  visualViewport,
  innerWidth,
  innerHeight,
} = {}) {
  return {
    width: positiveNumber(visualViewport?.width, positiveNumber(innerWidth, 1280)),
    height: positiveNumber(visualViewport?.height, positiveNumber(innerHeight, 720)),
  };
}

export function fitGameViewport({ width, height }, aspectRatio = GAME_ASPECT_RATIO) {
  if (width / height > aspectRatio) {
    return {
      width: height * aspectRatio,
      height,
    };
  }

  return {
    width,
    height: width / aspectRatio,
  };
}

export function installGameViewport(windowObject = globalThis.window) {
  const rootStyle = windowObject?.document?.documentElement?.style;
  if (!rootStyle) {
    return () => {};
  }

  const sync = () => {
    const viewport = resolveVisibleViewport(windowObject);
    const gameViewport = fitGameViewport(viewport);

    rootStyle.setProperty('--visible-viewport-width', `${viewport.width}px`);
    rootStyle.setProperty('--visible-viewport-height', `${viewport.height}px`);
    rootStyle.setProperty('--game-viewport-width', `${gameViewport.width}px`);
    rootStyle.setProperty('--game-viewport-height', `${gameViewport.height}px`);
  };

  const listeners = [
    [windowObject, 'resize'],
    [windowObject, 'orientationchange'],
    [windowObject.visualViewport, 'resize'],
    [windowObject.visualViewport, 'scroll'],
  ].filter(([target]) => target?.addEventListener);

  listeners.forEach(([target, event]) => target.addEventListener(event, sync));
  sync();

  return () => {
    listeners.forEach(([target, event]) => target.removeEventListener(event, sync));
  };
}
