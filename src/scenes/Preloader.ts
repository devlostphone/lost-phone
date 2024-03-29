import {dpr} from '../lib/Screen';
import {FakeOSScene} from '../lib/GameLib';
import Handler from './Handler';

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

        this.preload_general_images();
        this.preload_languages();
        this.preload_audio();
        this.preload_shaders();
        this.preload_textures();

        // More specific preloads.
        this.preload_app_icon_images();
        this.preload_gallery_images();
        this.preload_orwell_thumbnails();
        this.preload_contact_images();
        this.preload_track_images();
        this.preload_social_images();
        this.preload_shape_images();

        // @TODO: Make something more visual specific
        this.progressBar();
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
     * Preloads audio files.
     */
    protected preload_audio(): void {
        let tracks = this.cache.json.get('podcast');
        this.load.audio(tracks);
    }

    /**
     * Preloads shader files.
     */
    protected preload_shaders(): void {
        let shaders = this.cache.json.get('glsl');
        this.load.glsl(shaders[0].key, shaders[0].path);
    }

    /**
     * Preloads textures files.
     */
    protected preload_textures(): void {
        this.load.image('noise', 'gamedata/assets/textures/noise-medium.png');
        this.load.image('brickwall', 'gamedata/assets/textures/brickwall.png');
    }

    /**
     * Preload images method.
     */
    protected preload_general_images(): void {
        let imageSize = dpr * 128; // 64, 128, 256, 512
        this.load.image('app', this.get_theme_path('shaders/app@' + imageSize + 'x.png'));

        // Wallpaper: solid color or bitmap
        let wallpaper = this.cache.json.get('config').wallpaper;
        if (!wallpaper.match(/[0x]?[0-9A-Fa-f]{6}/g)) {
            console.log("Sets image as wallapper: " + wallpaper + '.png');
            this.load.image('wallpaper', this.get_theme_path('wallpapers/' + wallpaper + '.png'));
        } else {
            console.log("Sets wallpaper solid color: " + wallpaper);
        }

        // Get app backgrounds picture defined at config
        // Put the background pictures at themes/<name of theme>/app-backgrounds folder
        // @TODO: collect all pictures inside backgrounds folder. Set default or random if there
        // is more than one images.
        // @TODO: Add support for multiple format images (png, webp, jpeg...)

        // OS icons and other related stuff
        this.load.image('button-homescreen', this.get_theme_path('os/button-homescreen.png'));
        this.load.image('back-button', this.get_theme_path('os/back.png'));
        this.load.image('signal', this.get_theme_path('os/signal.png'));
        this.load.image('wifi', this.get_theme_path('os/wifi.png'));
        this.load.image('battery', this.get_theme_path('os/battery.png'));
        this.load.image('play-button', this.get_theme_path('os/play-button.png'));

        // Phone app icons
        this.load.image('received-call', this.get_theme_path('icons/received-call.png'));

        this.load.image('default-avatar', this.get_theme_path('shaders/default-avatar.png'));
        this.load.spritesheet('typing', this.get_theme_path('sprites/typing-spritesheet.png'), { frameWidth: 77, frameHeight: 38});

        // Mail icons
        this.load.image('list-icon', this.get_theme_path('icons/list.png'));
        this.load.image('search-icon', this.get_theme_path('icons/search.png'));
        this.load.image('write-icon', this.get_theme_path('icons/pencil-square.png'));
        this.load.image('ef-mail-icon', this.get_theme_path('icons/ef-mail-icon.png'));
        this.load.image('lostagram-mail-icon', this.get_theme_path('icons/lostagram-mail-icon.png'));

        // Lostagram icons
        this.load.image('heart-icon', this.get_theme_path('icons/heart-icon.png'));
        this.load.image('bubble-icon', this.get_theme_path('icons/bubble-icon.png'));
        this.load.image('share-icon', this.get_theme_path('icons/shareit-icon.png'));
        this.load.image('bookmark-icon', this.get_theme_path('icons/bookmark-icon.png'));

        let config = this.cache.json.get('config');
        this.load.image('broken-screen', this.get_theme_path('backgrounds/' + config.isScreenBroken));
    }

    /**
     * Preloads shape images (for buttons i.e).
     */
    protected preload_shape_images(): void {
        // @TODO: Rewrite this by a simple value iteration
        // @TODO: or maybe Phaser can draw vector shapes instead of bitmaps? Shame of you!
        this.load.image('arc@144', this.get_theme_path('shapes/arc@144.png'));
        this.load.image('arc@96', this.get_theme_path('shapes/arc@96.png'));
        this.load.image('arc@72', this.get_theme_path('shapes/arc@72.png'));

        this.load.image('rect@144', this.get_theme_path('shapes/rect@144.png'));
        this.load.image('rect@96', this.get_theme_path('shapes/rect@96.png'));
        this.load.image('rect@72', this.get_theme_path('shapes/rect@72.png'));
    }

    /**
     * Preloads icon app images.
     */
    protected preload_app_icon_images(): void {
        let apps = this.cache.json.get('apps');
        let iconsize = '@133';
        let format = 'png';

        for (let i = 0; i < apps.length; i++) {
            // @TODO: Need to load icon app images related to screen size?
            // switch (screen_size) {
            //     case 'desktop':
            // this.load.image(apps[i].type, this.get_theme_path('icons/' + apps[i].icon));
            //     case 'tablet':

            //     case 'mobile':
            // }
            this.load.image(apps[i].type, this.get_theme_path('icons/' + apps[i].type + iconsize + '.' + format));
        }
    }

    /**
     * Preloads gallery images.
     */
    protected preload_gallery_images(): void {
        let media = this.cache.json.get('gallery');

        for (let i = 0; i < media.length; i++) {
            switch (media[i].type) {
                case 'picture':
                    this.load.image(media[i].id, media[i].source);
                    break;
                case 'video':
                    this.load.video(media[i].id, media[i].source);
                    break;
            }
        }
    }

    /**
     * Preloads orwell thubnails and sites.
     */
    protected preload_orwell_thumbnails(): void {
        let thumbnails = this.cache.json.get('orwell');

        for (let i = 0; i < thumbnails.length; i++) {
            this.load.image(thumbnails[i].id, thumbnails[i].thumbnail);
        }
    }


    /**
     * Preloads contact images.
     */
    protected preload_contact_images(): void {
        let media = this.cache.json.get('chat');

        for (let i = 0; i < media.length; i++) {
            this.load.image(media[i].id, media[i].contactPic);

            for (let j in media[i].conversation) {
                if (media[i].conversation[j].pic !== undefined) {
                    this.load.image(media[i].conversation[j].pic, media[i].conversation[j].pic);
                }
            }
        }
    }

    /**
     * Preloads audio track images.
     */
    protected preload_track_images(): void {
        let tracks = this.cache.json.get('podcast');

        for (let i = 0; i < tracks.length; i++) {
            this.load.image(tracks[i].key, tracks[i].thumbnail);
        }
    }

    protected preload_social_images(): void {
        let social = this.cache.json.get('lostagram');

        for (let i = 0; i < social.length; i++) {
            this.load.image(social[i]['pic'], social[i]['pic']);
            this.load.image(social[i]['avatar'], social[i]['avatar']);
        }
    }

    /**
     * Returns asset theme path, defaults to "default" theme.
     *
     * @param path
     * @returns
     */
    protected get_theme_path(path: string): string {

        let theme = 'themes/' + this.cache.json.get('config')['theme']+'/';
        let defaultTheme = 'themes/default/';

        return theme+path;
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
        let iocosLogo = this.add.image(
            this.canvasWidth / 2,
            this.canvasHeight / 2 - 64,
            'ioc-os-logo'
        ).setOrigin(0.5, 0.5);

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
            iocosLogo.destroy();
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
