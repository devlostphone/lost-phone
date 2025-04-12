
import {dpr} from '../lib/Screen';
import {FakeOSScene} from '../lib/GameLib';

/**
 * Boot scene.
 */
export default class Boot extends FakeOSScene {

    /**
     * Class constructor.
     */
    public constructor() {
        super({
            key: 'boot',
            pack: {
                "files" : [
                    { type: "json", key: "config", url: "gamedata/config/config.json" },
                    { type: "json", key: "apps", url: "gamedata/config/apps.json" },
                    { type: "json", key: "colors", url: "gamedata/config/colors.json" },
                    { type: "json", key: "glsl", url: "gamedata/config/glsl.json"}
                ]
            }
        });
    }

    public preload(): void {
        this.preload_os_assets();
        this.preload_app_config();
    }

    /**
     * Preloads app-specific config file.
     */
    protected preload_os_assets(): void {
        this.load.image('ioc-os-logo', 'gamedata/assets/os/iocos.png');
    }

    /**
     * Preloads app-specific config file.
     */
    protected preload_app_config(): void {
        // Load json app files
        let apps = this.cache.json.get('apps');

        for (let i:number = 0; i < apps.length; i++) {
            if (apps[i].configFile) {
                this.load.json(apps[i].type, `gamedata/config/${apps[i].configFile}`);
            }
        }
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
