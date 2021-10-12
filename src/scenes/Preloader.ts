import {dpr} from '~/lib/Screen';
import {FakeOSScene} from '~/lib/GameLib';
import Handler from '~/scenes/Handler';

/**
 * Preloader scene.
 */
export default class Preloader extends FakeOSScene {

    /**
     * Canvas width.
     */
    canvasWidth: number;

    /**
     * Canvas height.
     */
    canvasHeight: number;

    /**
     * Class constructor.
     */
    public constructor() {
        super({ key : 'preloader' });
        this.canvasWidth = 0;
        this.canvasHeight = 0;
    }

    /**
     * Preload method.
     */
    public preload(): void {
        super.preload();
        this.canvasWidth = this.sys.game.canvas.width;
        this.canvasHeight = this.sys.game.canvas.height;

        if (this.handlerScene instanceof Handler) {
            this.handlerScene.sceneRunning = 'preload';
        }
        this.sceneStopped = false;

        this.preload_images();
        this.preload_app_config();
        this.preload_languages();

        this.progressBar();
    }

    /**
     * Preloads app-specific config file.
     */
    protected preload_app_config(): void {
        // Load json app files
        let apps = this.cache.json.get('apps');
        for (var i = 0; i < apps.length; i++) {
            if (apps[i].configFile) {
                this.load.json(apps[i].type, `config/${apps[i].type}.json`);
            }
        }
    }

    /**
     * Preloads lang files.
     */
    protected preload_languages(): void {
        // Load language
        let lang = this.cache.json.get('config')['language'];
        this.load.json(`lang-${lang}`, `lang/${lang}.json`);
    }

    /**
     * Preload images method.
     */
    public preload_images(): void {
        let imageSize = dpr * 128; // 64, 128, 256, 512
        this.load.image('app', 'assets/app@' + imageSize + 'x.png');
        this.load.image('guide', 'assets/720x1280-guide.png');

        this.load.image('lorem-appsum', `assets/iconApp-@2.png`);
        this.load.image('button-homescreen', 'assets/button-homescreen.png');
        this.load.image('background', 'assets/img/backgrounds/library.png');
    }

    /**
     * Create method.
     */
    public create(): void {
        const { width, height } = this;
        // CONFIG SCENE
        if (this.handlerScene instanceof Handler) {
            this.handlerScene?.updateResize(this);
        }

        // More specific preloads.
        this.preload_gallery_images();
    }

    public preload_gallery_images(): void {
        let media = this.cache.json.get('gallery');

        for (let i = 0; i < media.length; i++) {
            this.load.image(media[i].id, 'assets/' + media[i].source);
        }
    }

    /**
     * Prints a progress bar.
     */
    public progressBar(): void {
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
                    if (this.handlerScene instanceof Handler) {
                        this.handlerScene?.launchScene('fakeOS');
                    }
                }
            });
        });
    }
}
