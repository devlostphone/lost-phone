import Handler from '/src/scenes/Handler';
import Preloader from '/src/scenes/Preloader';
import Boot from '/src/scenes/Boot';
import { FakeOS } from '/src/scenes/FakeOS';
import '/src/import';

export const MAX_SIZE_WIDTH_SCREEN = 1920;
export const MAX_SIZE_HEIGHT_SCREEN = 1920;
export const MIN_SIZE_WIDTH_SCREEN = 360;
export const MIN_SIZE_HEIGHT_SCREEN = 640;
export const SIZE_WIDTH_SCREEN = 720;
export const SIZE_HEIGHT_SCREEN = 1280;

export const config:  Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    title: 'Lost & Phone',


    scale: {
        width: SIZE_WIDTH_SCREEN,
        height: SIZE_HEIGHT_SCREEN,
        mode: Phaser.Scale.RESIZE,
        parent: 'game',
        min: {
            width: MIN_SIZE_WIDTH_SCREEN,
            height: MIN_SIZE_HEIGHT_SCREEN
        },
        max: {
            width: MAX_SIZE_WIDTH_SCREEN,
            height: MAX_SIZE_HEIGHT_SCREEN
        }
    },
    dom: {
        createContainer: true
    },
    scene: [
        Handler,
        Boot,
        Preloader,
        FakeOS
    ],
};