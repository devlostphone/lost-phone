import {FakeOSScene} from '../lib/GameLib';
import Handler from './Handler';
import UI from '../lib/ui/phoneUI';
import App from '../lib/apps/App';
import AppFactory from '../lib/apps/AppFactory';
import { PhoneEvents, SystemEvents } from '../lib/events/GameEvents';
import HomescreenApp from '../lib/apps/HomescreenApp';

/**
 * FakeOS.
 */
export class FakeOS extends FakeOSScene {

    /**
     * FakeOS UI.
     */
    public UI: UI;

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
     * Is the Phone locked at start?
     */
    protected isLocked: boolean = false;

    public isScreenBroken: boolean = false;

    /**
     * Class constructor.
     */
    public constructor() {
        super('fakeOS');
        this.UI = new UI(this);
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
        this.isLocked = this.cache.json.get('config').locked && !this.checkDone('unlocked');
        this.lang = this.cache.json.get('config').language;
        this.debug = this.cache.json.get('config').debug;
        this.colors = this.cache.json.get('colors');
        this.apps = this.cache.json.get('apps');
        this.isScreenBroken = this.cache.json.get('config').isScreenBroken !== false;
        this.sound.pauseOnBlur = false;

        // Load all the App Backgrounds defined at config
        let backgrounds = this.cache.json.get('config').backgrounds;
        for (let i = 0; i < backgrounds.length; i++) {
            this.load.image(backgrounds[i] +  '-background', this.get_theme_path(`backgrounds/${backgrounds[i]}.png`));
            console.info("Load " + this.get_theme_path(`backgrounds/${backgrounds[i]}.png`));
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

        this.setWallpaper();

        // Render the UI
        this.UI.render();

        // Render the first screen (homescreen or unlockscreen)
        this.activeApp = AppFactory.createInstance(
            this.isLocked ? 'UnlockScreenApp' : 'HomescreenApp',
            this
        );
        this.activeApp?.render();
        this.addSystemEventsListeners();

        // Check new notifications at start
        this.launchEvent(PhoneEvents.ActivityFinished);
    }

    /**
     * Sets the Camera Wallpaper.
     */
    public setWallpaper(): void {
        let wallpaper = this.cache.json.get('config').wallpaper;
        if (wallpaper.match(/[0x]?[0-9A-Fa-f]{6}/g)) {
            this.cameras.main.setBackgroundColor(wallpaper);
        } else {
            this.background = this.add.image(
                this.width / 2,
                this.height / 2,
                'wallpaper'
            ).setOrigin(0.5, 0.5)
                .setScale(1.5);
        }
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
     * Clears the back function stack.
     */
    public clearBackFunction(): void {
        this.backFunction = [];
    }

    /**
     * Appends a new function to the back button function stack.
     *
     * @param func
     */
    public addBackFunction(func: any): any {
        this.backFunction.push(func);
        this.log(this.backFunction);
    }

    /**
     * Uses the last back button function from the stack and removes it.
     */
    public useBackFunction(): void {
        if (this.backFunction.length > 0) {
            this.backFunction.pop()();
            this.log(this.backFunction);
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
    public launchApp(key: string, icon?: any): void {
        this.log('Shutting down: ' + this.activeApp?.getKey());
        let animation = false;
        let previousApp = this.activeApp;

        if (previousApp?.getKey() == key) {
            return;
        }

        this.getUI().fixedElements?.removeAll(true);
        this.input.removeAllListeners();
        this.removePhoneEvents();
        this.time.removeAllEvents();

        this.log('Launching App: '+key);
        try {
            this.activeApp = AppFactory.createInstance(key, this);
        } catch (error: any) {
            this.log(error);
            this.log('Defaulting to homescreen');
            this.activeApp = AppFactory.createInstance('HomescreenApp', this);
        }
        this.activeApp?.render();

        // Was it launched from homescreen?
        if (this.activeApp && this.activeApp.getKey() != 'HomescreenApp' && icon !== undefined) {
            this.log("Launched from homescreen.");
            animation = true;
            let activeLayer = this.activeApp.getActiveLayer();
            activeLayer.scaleX = icon.width / this.width;
            activeLayer.scaleY = icon.height / this.height;
            activeLayer.x = icon.x;
            activeLayer.y = icon.y;
            activeLayer.alpha = 0;

            icon.destroy();

            this.tweens.add({
                targets: activeLayer,
                x: 0,
                y: 0,
                alpha: 1,
                scaleX: 1,
                scaleY: 1,
                duration: 150,
                onComplete: () => {
                    previousApp?.destroy();
                }
            });
        }

        // Going back to homescreen?
        if (previousApp && this.activeApp instanceof HomescreenApp) {
            this.log("Going back to homescreen.");
            animation = true;
            let previousAppLayer = previousApp.getActiveLayer();
            previousAppLayer.setDepth(1000);
            let icon = this.activeApp.getIconByAppName(previousApp.getType());

            if (icon !== undefined) {

                icon.setAlpha(0);

                this.tweens.add({
                    targets: previousAppLayer,
                    x: icon.x + previousApp.activeLayer * this.width,
                    y: icon.y,
                    alpha: 0.3,
                    scaleX: icon.width / this.width,
                    scaleY: icon.height / this.height,
                    duration: 150,
                    onComplete: () => {
                        previousApp?.destroy();
                        icon.setAlpha(1);
                    }
                });
            } else {
                this.tweens.add({
                    targets: previousAppLayer,
                    x: this.width*0.1,
                    y: this.height*0.1,
                    alpha: 0.3,
                    scaleX: 0.8,
                    scaleY: 0.8,
                    duration: 150,
                    onComplete: () => {
                        previousApp?.destroy();
                    }
                });
            }
        }

        this.getUI().addInputListeners();
        this.getUI().addEventListeners();

        // Delete back function when in homescreen.
        if (['HomescreenApp','UnlockScreenApp'].includes(key)) {
            this.backFunction = [];
        } else {
            this.addBackFunction(() => {
                this.launchApp('HomescreenApp');
            });
        }

        if (!animation) {
            previousApp?.destroy();
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
     * Switches to a new app and add old app as back function.
     *
     * @param app
     * @param id
     */
    protected switchApp(app: string, id?: string): void {
        let activeapp = this.activeApp;
        if (activeapp !== undefined) {
            let currentID = activeapp.getCurrentID();
            this.log('Clicked on element: ' + id);
            this.log('Will go back to '+activeapp.getKey()+' & ID: ' + currentID);

            this.clearBackFunction();
            this.addBackFunction(() => {
                if (activeapp !== undefined) {
                    this.launchApp(activeapp.getKey());
                    this.getActiveApp().goToID(currentID, true);
                }
            });
            this.launchApp(app);
            this.backFunction.pop();
            if (id !== undefined) {
                this.getActiveApp().goToID(id, true);
                this.backFunction.pop();
            }
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

    /**
     * Add system events listeners
     */
    public addSystemEventsListeners() {

        // Listen to clicking images -> redirect to gallery
        this.addEventListener(SystemEvents.ImageClicked, (id: string) => {
            this.switchApp('GalleryApp', id);
        });

        // Listen to clicking links -> redirect to browser
        this.addEventListener(SystemEvents.LinkClicked, (id: string) => {
            this.switchApp('BrowserApp', id);
        });

        this.addEventListener(SystemEvents.PasswordProtected, (id: string, password: string) => {
            this.launchPasswordProtectedModal(id, password);
        });
        this.addEventListener(SystemEvents.PasswordCorrect, (id: string) => {
            this.setDone(id);
            this.getActiveApp().goToID(id);
        });
    }

    /**
     * Strips tag from text.
     *
     * @param tag
     * @returns
     */
    public stripAppTag(tag: string): string {
        if (/[gallery|browser|document]:/.test(tag)) {
            let matches = tag.match(/[gallery|browser|document]:(.*):(.*)/i);
            return matches ? matches[2]: tag;
        }

        return tag;
    }

    /**
     * Generates a Phaser GameObject with event attached for switching apps.
     */
    public generateAppLink(tag: string, options?: any): any {
        let gameobject, matches, id: string, event: string;

        switch (true) {
            case /gallery/.test(tag):
                matches = tag.match(/gallery:(.*)/i);
                id = matches ? matches[1] : "";
                gameobject = new Phaser.GameObjects.Image(
                    this, 0, 0, id
                ).setName(id);
                event = SystemEvents.ImageClicked;
                break;

            case /browser/.test(tag):
                matches = tag.match(/browser:(.*):(.*)/i);
                id = matches ? matches[1] : "";
                gameobject = new Phaser.GameObjects.Text(
                    this, 0, 0, matches ? matches[2] : "Link", options
                ).setName(id);
                event = SystemEvents.LinkClicked;
                break;

            case /document/.test(tag):
                break;

            default:
                return undefined;
        }

        this.addInputEvent('pointerup', () => {
            this.launchEvent(event, id);
        }, gameobject);

        return gameobject;
    }

    /**
     * Shows input password screen.
     *
     * @param id
     * @param password
     */
    public launchPasswordProtectedModal(id: string, password: string): void {

        this.getActiveApp().skipLayerChangeAnim = true;
        this.getActiveApp().addLayer();
        let text = this.add.text(
            0,0,
            this.getString('fill-password')
        );
        this.getActiveApp().addRow(text, {y: 3});

        let input = this.add.dom(0,0).createFromHTML('<input type="text" name="password" />');
        let enter = this.add.text(
            0,0,
            'ENTER'
        );
        this.getActiveApp().addRow([input, enter], {y: 4});

        this.addInputEvent('pointerup', ()=>{
            let user_input = (<HTMLInputElement>input.getChildByName('password')).value;
            this.log("Input password: " + user_input + " against " + password);
            if (password == user_input) {
                this.launchEvent(SystemEvents.PasswordCorrect, id);
            } else {
                text.text = this.getString('incorrect-password');
            }
        }, enter);

        this.addBackFunction(() => {
            this.getActiveApp().skipLayerChangeAnim = true;
            input.destroy();
            this.useBackFunction();
        })


    }
}
