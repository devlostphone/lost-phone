import 'phaser';

import {
    config,
    MAX_SIZE_WIDTH_SCREEN,
    MAX_SIZE_HEIGHT_SCREEN,
    MIN_SIZE_WIDTH_SCREEN,
    MIN_SIZE_HEIGHT_SCREEN,
    SIZE_WIDTH_SCREEN,
    SIZE_HEIGHT_SCREEN
} from '~/config';

function newGame(gameConfig: object): Phaser.Game {
    game = new Phaser.Game(gameConfig);

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

let game = newGame(config);


