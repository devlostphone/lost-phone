import {dpr} from 'lib/Screen';
import LostAndPhone from 'lib/GameLib';
import Handler from 'scenes/Handler';

export default class Preloader extends LostAndPhone.Scene {

    canvasWidth?: integer;
    canvasHeight?: integer;

    constructor() {
        super({ key : 'preloader' });
    }

    public preload() {
        super.preload();
        // load assets here
        let imageSize = dpr * 128; // 64, 128, 256, 512
        this.load.image('app', 'assets/app@' + imageSize + 'x.png');
        this.load.image('guide', 'assets/720x1280-guide.png');

        this.load.image('lorem-appsum', `assets/iconApp-@2.png`);
        this.load.image('button-homescreen', 'assets/button-homescreen.png');

        this.canvasWidth = this.sys.game.canvas.width;
        this.canvasHeight = this.sys.game.canvas.height;

        if (this.handlerScene instanceof Handler) {
            this.handlerScene.sceneRunning = 'preload';
        }
        this.sceneStopped = false;

        // simple preload again
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x0, 0.8);
        progressBox.fillRect(
            (this.canvasWidth / 2) - (210 / 2),
            (this.canvasHeight / 2) - 5,
            210, 30
        );
        let progressBar = this.add.graphics();

        this.load.on('progress',  (value:any) => {
            if (this.canvasWidth !== undefined && this.canvasHeight !== undefined) {
                progressBar.clear();
                progressBar.fillStyle(0xe5ffff, 1);
                progressBar.fillRect(
                    (this.canvasWidth / 2) - (200 / 2),
                    (this.canvasHeight / 2),
                    200 * value, 20
                );
            }
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    this.sceneStopped = true;
                    this.scene.stop('preload');
                    this.handlerScene?.cameras.main.setBackgroundColor("#020079");
                    if (this.handlerScene instanceof Handler) {
                        this.handlerScene?.launchScene('fakeOS');
                    }
                }
            });
        });

        // Load json config files
        let config = ['config', 'apps', 'tracks', 'wifi', 'mail', 'colors'];
        for (var i = 0; i < config.length; i++) {
            this.load.json(config[i], `config/${config[i]}.json`);
        }

        // Load languages
        this.load.json('language-ca', 'lang/ca.json');
        this.load.json('language-en', 'lang/en.json');
    }

    public create() {
        const { width, height } = this;
        // CONFIG SCENE
        if (this.handlerScene instanceof Handler) {
            this.handlerScene?.updateResize(this);
        }
    }

}
