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
        this.preload_languages();
        this.preload_audio();

        // More specific preloads.
        this.preload_gallery_images();
        this.preload_contact_images();
        this.preload_track_images();

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

    protected preload_audio(): void {
        let tracks = this.cache.json.get('podcast');
        this.load.audio(tracks);
    }

    /**
     * Preload images method.
     */
    public preload_images(): void {
        let imageSize = dpr * 128; // 64, 128, 256, 512
        this.load.image('app', 'assets/app@' + imageSize + 'x.png');

        // Icon apps
        // TODO: Replace them by new ones made by hand
        let apps = this.cache.json.get('apps');
        for (let i = 0; i < apps.length; i++) {
            this.load.image(apps[i].type, 'assets/apps/' + apps[i].icon);
        }

        this.load.image('guide', 'assets/720x1280-guide.png');

        this.load.image('lorem-appsum', `assets/iconApp-@2.png`);
        this.load.image('button-homescreen', 'assets/button-homescreen.png');
        this.load.image('background', 'assets/img/backgrounds/background.jpg');

        this.load.image('play-button', 'assets/img/icons/play-button.png');
        this.load.image('back-button', 'assets/img/icons/back.png');

        this.load.image('default-avatar', 'assets/default-avatar.png');
        this.load.spritesheet('typing', 'assets/typing-spritesheet.png', { frameWidth: 77, frameHeight: 38});
    }

    public preload_gallery_images(): void {
        let media = this.cache.json.get('gallery');

        for (let i = 0; i < media.length; i++) {
            switch (media[i].type) {
                case 'picture':
                    this.load.image(media[i].id, 'assets/' + media[i].source);
                    break;
                case 'video':
                    this.load.video(media[i].id, 'assets/' + media[i].source);
            }
        }
    }

    public preload_contact_images(): void {
        let media = this.cache.json.get('chat');

        for (let i = 0; i < media.length; i++) {
            this.load.image(media[i].id, 'assets/' + media[i].contactPic);
        }
    }

    public preload_track_images(): void {
        let tracks = this.cache.json.get('podcast');

        for (let i = 0; i < tracks.length; i++) {
            this.load.image(tracks[i].key, 'assets/' + tracks[i].thumbnail);
        }
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
