import {FakeOSScene} from '~/lib/GameLib';
import Handler from '~/scenes/Handler';
import UI from '~/lib/ui/phoneUI';
import App from '~/lib/apps/App';
import AppFactory from '~/lib/apps/AppFactory';
import { PhoneEvents } from '~/lib/events/GameEvents';

/**
 * FakeOS.
 */
export class FakeOS extends FakeOSScene {

    /**
     * FakeOS UI.
     */
    protected UI: UI;

    /**
     * The app which is active.
     */
    protected activeApp?: App;

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
     * Function called when pressed "back" button
     */
    protected backFunction: any = [];

    /**
     * Class constructor.
     */
    public constructor() {
        super('fakeOS');
        this.UI = new UI(this);
        //this.activeApp = AppFactory.createInstance('HomescreenApp', this);
    }

    /**
     * Preload method.
     */
    public preload(): void {
        super.preload();
        this.cleanState();

        let password = this.getPassword();
        if (password !== null) {
            this.loadState(password[1]);
            this.saveState();
            this.clearURL();
        } else {
            this.loadState();
        }

        this.handlerScene.sceneRunning = 'fakeOS';

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

        this.input.setTopOnly(false);
        this.input.setGlobalTopOnly(false);

        this.cameras.main.setRoundPixels(false);
        if (this.handlerScene instanceof Handler) {
            this.handlerScene?.updateResize(this);
        }

        this.setBackground();

        // Render the UI
        this.UI.render();

        // Render the homescreen
        this.activeApp = AppFactory.createInstance('HomescreenApp', this);
        this.activeApp?.render();

        // Start listening to events
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
     * Returns the back button function.
     *
     * @returns any
     */
    public getBackFunction(): any {
        return this.backFunction;
    }

    /**
     * Appends a new function to the back button function stack.
     *
     * @param func
     */
    public addBackFunction(func: any): any {
        this.backFunction.push(func);
    }

    /**
     * Uses the last back button function from the stack and removes it.
     */
    public useBackFunction(): void {
        if (this.backFunction.length > 0) {
            this.backFunction.pop()();
        }
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
        if (typeof this.activeApp?.update === 'function') {
            this.activeApp?.update(delta, time);
        }
    }

    /**
     * Returns the active app.
     * @returns App
     */
    public getActiveApp(): App {
        if (this.activeApp !== undefined) {
            return this.activeApp;
        } else {
            return AppFactory.createInstance('HomescreenApp', this);
        }
    }

    /**
     * Launches a new app and sets it as active.
     *
     * @param key   The app key.
     */
    public launchApp(key: string): void {
        this.log('Shutting down: ' + this.activeApp?.constructor.name);
        this.activeApp?.destroy();
        this.input.removeAllListeners();
        this.removePhoneEvents();
        this.time.removeAllEvents();

        this.log('Launching App: '+key);
        this.activeApp = AppFactory.createInstance(key, this);
        this.activeApp?.render();
        this.getUI().addInputListeners();
        this.getUI().addEventListeners();

        // Delete back function when in homescreen.
        if (key == 'HomescreenApp') {
            this.backFunction = [];
        } else {
            this.addBackFunction(() => {
                this.launchApp('HomescreenApp');
            });
        }
    }

    /**
     * Removes only PhoneEvents listeners.
     */
    public removePhoneEvents() {
        let key: keyof typeof PhoneEvents;

        for (key in PhoneEvents) {
            this.game.events.removeAllListeners(PhoneEvents[key]);
        }
    }
}