import 'phaser';
import LostAndPhone from '~/lib/GameLib';

import {
    config,
    MAX_SIZE_WIDTH_SCREEN,
    MAX_SIZE_HEIGHT_SCREEN,
    MIN_SIZE_WIDTH_SCREEN,
    MIN_SIZE_HEIGHT_SCREEN,
    SIZE_WIDTH_SCREEN,
    SIZE_HEIGHT_SCREEN
} from '~/config';

function newGame(gameConfig: object) {
    game = new LostAndPhone.Game(gameConfig);

    game.screenBaseSize = {
      maxWidth: MAX_SIZE_WIDTH_SCREEN,
      maxHeight: MAX_SIZE_HEIGHT_SCREEN,
      minWidth: MIN_SIZE_WIDTH_SCREEN,
      minHeight: MIN_SIZE_HEIGHT_SCREEN,
      width: SIZE_WIDTH_SCREEN,
      height: SIZE_HEIGHT_SCREEN
    };
    game.orientation = "portrait-primary";

    return game;
}

function destroyGame() {
    if (game === undefined) return;
    game.destroy(true);
    game.runDestroy();
    game = undefined;
}

let game: LostAndPhone.Game | undefined = undefined;

if (game === undefined) {
    game = newGame(config);
}

