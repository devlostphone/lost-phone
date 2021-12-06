
import {dpr} from '~/lib/Screen';
import {FakeOSScene} from '~/lib/GameLib';

/**
 * Boot scene.
 */
export default class Boot extends FakeOSScene {

    /**
     * Class constructor.
     */
    public constructor() {
        super({ key: 'boot'});
    }

    public preload(): void {
        this.load.json('config', 'config/config.json');
        this.load.json('apps', 'config/apps.json');
        this.load.json('colors', 'config/colors.json');
        this.preload_app_config();
    }

    /**
     * Preloads app-specific config file.
     */
    protected preload_app_config(): void {
        // Load json app files
        /*let apps = this.cache.json.get('apps');
          for (var i = 0; i < apps.length; i++) {
          console.log('Loading ' + apps[i].type);
          if (apps[i].configFile) {
          this.load.json(apps[i].type, `config/${apps[i].type}.json`);
          }
          }*/
        // @TODO: check this
        this.load.json('mail', 'config/mail.json');
        this.load.json('gallery', 'config/gallery.json');
        this.load.json('chat', 'config/chat.json');
        this.load.json('podcast', 'config/podcast.json');
        this.load.json('unlock-screen', 'config/unlock-screen.json');
        this.load.json('calendar', 'config/calendar.json');
    }

    /**
     * Create method.
     */
    public create(): void {
        // window.addEventListener('resize', this.resize.bind(this));
        this.scene.start('preloader');
    }

    /**
     * Resize method.
     */
    public resize(): void {
        let w = window.innerWidth * dpr;
        let h = window.innerHeight * dpr;
        // manually resize the game with the Phaser 3.16 scalemanager
        if (w > h) {
            w = h * 0.6 * dpr;
            h = h * dpr;
        } else {
            w = w * dpr;
            h = h * dpr;
        };
        this.scale.resize(w, h);

        // Check which scene is active.
        for (let scene of this.scene.manager.scenes) {
            if (scene.scene.settings.active) {
                // Scale the camera
                scene.cameras.main.setViewport(0, 0, w, h);
                //if (scene.resizeField) {
                    // Scale/position stuff in the scene itself with this method, that the scene must implement.
                    //scene.resizeField(w, h);
                //}
            }
        }
    }
}
