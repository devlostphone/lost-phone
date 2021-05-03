import 'phaser';
import Main from 'scenes/main';

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    width: 800,
    height: 600,
    scene: Main
};

const game = new Phaser.Game(config);
