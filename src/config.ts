import Handler from 'scenes/Handler';
import Preloader from 'scenes/Preloader';
import Boot from 'scenes/Boot';
import PlayGround from 'scenes/PlayGround';

// Default Vertical Aspect Ratio: 9:16 (1:1.77)
// 0,5625

export const MAX_SIZE_WIDTH_SCREEN = 1920;
export const MAX_SIZE_HEIGHT_SCREEN = 1920;
export const MIN_SIZE_WIDTH_SCREEN = 360;
export const MIN_SIZE_HEIGHT_SCREEN = 640;
export const SIZE_WIDTH_SCREEN = 720;
export const SIZE_HEIGHT_SCREEN = 1280;

export const config:  Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#ff00ff',
  title: 'Lost & Phone',

  // Here's the trick
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
  scene: [
    Handler,
    Boot,
    Preloader,
    PlayGround
  ],
};