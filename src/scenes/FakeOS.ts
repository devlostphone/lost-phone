import LostAndPhone from 'lib/GameLib';
import Handler from 'scenes/Handler';
import UI from 'lib/ui/phoneUI';
import App from 'lib/apps/App';
import AppFactory from 'lib/apps/AppFactory';

/**
 * FakeOS.
 */
export class FakeOS extends LostAndPhone.Scene {

    /**
     * FakeOS UI.
     */
    protected UI: UI;

    /**
     * The app which is active.
     */
    protected activeApp: App;

    /**
     * Background image.
     */
    protected background?: Phaser.GameObjects.Image;

    /**
     * Debug mode.
     */
    public debug: boolean = false;

    /**
     * Colors.
     */
    public colors?: any ;

    /**
     * Apps.
     */
    public apps?: any;

    /**
     * Class constructor.
     */
    public constructor() {
        super({ key : 'fakeOS'});
        this.activeApp = AppFactory.createInstance('HomescreenApp', this);
        this.UI = new UI(this);
        //this.initSettings();;
    }

    /**
     * Preload method.
     */
    public preload(): void {
        super.preload();
        if (this.handlerScene instanceof Handler) {
            this.handlerScene.sceneRunning = 'fakeOS';
        }
        // Setup basic config
        this.lang = this.cache.json.get('config').language;
        this.debug = this.cache.json.get('config').debug == 'dev';
        this.colors = this.cache.json.get('colors');
        this.apps = this.cache.json.get('apps');

        let wallpapers = this.cache.json.get('config').wallpapers;
        for (let i = 0; i < wallpapers.length; i++) {
            this.load.image(wallpapers[i]+ '-wallpaper', `assets/img/wallpapers/${wallpapers[i]}.png`);
        }
    }

    /**
     * Create method.
     */
    public create(): void {
        this.cameras.main.setRoundPixels(true);
        if (this.handlerScene instanceof Handler) {
            this.handlerScene?.updateResize(this);
        }

        this.setBackground();

        // Render the UI
        this.UI = new UI(this);
        this.UI.render();

        // Render the homescreen
        this.activeApp.render();
    }

    /**
     * Sets the background.
     */
    public setBackground(): void {
        this.background = this.add.image(
            this.width / 2,
            this.height / 2,
            'background'
        ).setOrigin(0.5, 0.5)
        .setScale(1.5);
    }

    /**
     * Returns the UI object.
     *
     * @returns FakeOS UI
     */
    public getUI(): UI {
        return this.UI;
    }

    /**
     * Returns Phaser.Game object.
     *
     * @returns Phaser.Game
     */
    public getGame(): Phaser.Game {
        return this.game;
    }

    /**
     * Logs a message into the console.
     * Only works if debug is enabled.
     *
     * @param message   The message to print.
     */
    public log(message: string): void {
        if (this.debug) {
            console.log('[Scene: '+this.scene.key+'] '+message);
        }
    }

    /**
     * Updates the scene.
     *
     * @param delta
     * @param time
     */
    public update(delta: any, time: any): void {
        this.UI?.update(delta, time);
        if (typeof this.activeApp.update === 'function') {
            this.activeApp.update(delta, time);
        }
    }

    /**
     * Launches a new app and sets it as active.
     *
     * @param key   The app key.
     */
    public launchApp(key: string): void {
        this.log('Shutting down: ' + this.activeApp.constructor.name);
        this.activeApp.destroy();

        this.log('Launching App: '+key);
        this.activeApp = AppFactory.createInstance(key, this);
        this.activeApp.render();
    }
}