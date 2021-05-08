import Phaser from 'phaser';
import {dpr} from 'lib/Screen';
import LostAndPhone from 'lib/GameLib';
import Handler from './Handler';

class PlayGround extends LostAndPhone.Scene {

    app: undefined;
    sampleText?: string;
    graphics?: undefined;
    handlerScene?: Handler;

    constructor() {
        super({ key : 'playground'});
        this.app = undefined;
        this.graphics;
        this.handlerScene = undefined;
    }

    preload() {
        // this.sceneStopped = true;
        if (this.game instanceof LostAndPhone.Game) {
            this.width = this.game.screenBaseSize?.width;
            this.height = this.game.screenBaseSize?.height;
        }

        let handler = this.scene.get('handler');
        if (handler instanceof Handler) {
            this.handlerScene = handler;
        }
        // this.handlerScene.sceneRunning = 'playground';
    }

    create() {

        // This will prevent pixels from being drawn at half coordinates. It will also help stick your tilemaps together.
        this.cameras.main.setRoundPixels(true);

        // CONFIG SCENE
        const { width , height } = this;
        if (this.handlerScene instanceof Handler) {
            this.handlerScene.updateResize(this);
        }
        // CONFIG SCENE

        // DEBUG
        this.add.image(0, 0, 'guide').setOrigin(0).setDepth(1);
        // DEBUG


        // GAME OBJECTS

    // Display main icons in a row with its names
        for (var i = 0; i < 4; i++) { // columns
            for (var j = 0; j < 3; j++) { // rows
                if ((i + (4 * j)) < 10) {
                    var app = this.add.image(0, 0, 'app');
                    app.setOrigin(0);
                    app.setScale(1 / dpr);
                    var margin = 50;
                    var vmarginfromtop = 96;
                    var hpadding = 36;
                    var vpadding = 64;
                    app.setPosition(
                        (i * app.width * (1/dpr) + (i * hpadding)) + margin,
                        (j * app.width * (1/dpr) + (j * vpadding)) + vmarginfromtop);

                    var sampleText = this.add.text(
                        app.x,
                        app.y + (app.height / dpr) + (4 * dpr),
                        'Lorem ipsum',
                        { fontFamily: 'Arial', fontSize: '22px', color: '#fff' }
                    ).setOrigin(0);
                }
            }
        }

        // Display three app icons at the bottom
        for (var i = 0; i < 3; i++) {
            if (this.width !== undefined && this.height !== undefined) {
                var app = this.add.image(0, 0, 'app');
                app.setOrigin(0);
                app.setScale(1 / dpr);
                var hpadding = 48;
                var margin = (this.width) / 2 - ((app.width * (1 / dpr) * 3) / 2) - (hpadding * 2 / 2);
                var vpadding = this.height - app.height * (1 / dpr) - 320;
                app.setPosition(
                    i * app.width * (1 / dpr) + (i * hpadding) +  margin,
                    app.width * (1 / dpr) + vpadding
                );

                var sampleText = this.add.text(
                    app.x,
                    app.y + (app.height / dpr) + (4 * dpr),
                    'Lorem ipsum',
                    { fontFamily: 'Arial', fontSize: '22px', color: '#fff' }
                ).setOrigin(0);
            }
        }
    // GAME OBJECTS

    }

    update(){
        // Display text bounds only for testing purpose
        // this.graphics.clear();
        // this.graphics.lineStyle(1, 0xff0000, 1);
        // this.graphics.strokeRectShape(this.sampleText.getBounds());
    }
}

export default PlayGround;
