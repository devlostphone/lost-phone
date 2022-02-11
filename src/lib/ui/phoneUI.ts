import { FakeOS } from '~/scenes/FakeOS';
import Time from '~/lib/ui/gameObjects/Time';
import NotificationDrawer from '~/lib/ui/gameObjects/notifications/NotificationDrawer';
import { PhoneEvents } from '../events/GameEvents';

/**
 * FakeOS UI.
 */
export default class phoneUI {

    /**
     * FakeOS
     */
    public fakeOS: FakeOS;

    /**
     * UI elements.
     */
    public elements: {
        topBar?: any,
        bottomBar?: any,
        clock?: any,
        homeButton?: any,
        backButton?: any,
        drawer?: NotificationDrawer
    };

    /**
     * Container game object with all UI game objects.
     */
    public container?: Phaser.GameObjects.Container;

    /**
     * Is the notification drawer open?
     */
    public isDrawerOpen: boolean;

    /**
     * Class constructor.
     *
     * @param fakeOS FakeOS
     */
    public constructor(fakeOS: FakeOS) {
        this.fakeOS = fakeOS;
        this.elements = {};
        this.isDrawerOpen = false;
    }

    /**
     * Renders the UI.
     */
    public render(): void {
        this.container = this.fakeOS.add.container(0,0).setDepth(1000);
        this.fakeOS.log('Loading UI');
        this.setWallpaper();
        this.createBars();
        this.createButtons();
        this.createClock();
        this.createDrawer();

        this.fakeOS.log('Setting up UI listeners');
        this.addEventListeners();
        this.addInputListeners();
        this.applyMask();
    }

    protected applyMask(): void {
        let graphics = new Phaser.GameObjects.Graphics(this.fakeOS);
        graphics.fillRect(
            0,0,
            this.fakeOS.width,
            this.fakeOS.height
        );
        let mask = new Phaser.Display.Masks.GeometryMask(
            this.fakeOS,
            graphics
        );
        this.container?.setMask(mask);
    }

    /**
     * Returns app rendering area dimensions
     *
     * @returns {width, height}
     */
    public getAppRenderSize(): any {
        return {
            x: 0,
            y: this.elements.topBar.height,
            width: this.fakeOS.width,
            height: this.fakeOS.height - this.elements.topBar.height - this.elements.bottomBar.height
        }
    }

    /**
     * Sets the FakeOS wallpaper.
     */
    protected setWallpaper(): void {
        let wallpapers = this.fakeOS.cache.json.get('config').wallpapers;
        let wallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)] + '-wallpaper';
        let scale = this.fakeOS.textures.get(wallpaper).getSourceImage();
        this.fakeOS.add.image(
            Math.round(this.fakeOS.width / 2),
            Math.round(this.fakeOS.height / 2),
            wallpaper)
        .setOrigin(0.5, 0.5)
        .setScale(
            this.fakeOS.width / scale.width,
            this.fakeOS.height / scale.height
        );
    }

    /**
     * Shows home button.
     */
    public showHomeButton(): void {
        this.elements.homeButton.setVisible(true);
    }

    /**
     * Hides home button.
     */
    public hideHomeButton(): void {
        this.elements.homeButton.setVisible(false);
    }

    /**
     * Creates the top and bottom bars.
     */
    protected createBars(): void {
        this.fakeOS.log('Creating top bar');
        // Display top and bottom bars
        this.elements.topBar = this.fakeOS.add.rectangle(
            0,
            0,
            this.fakeOS.width,
            this.fakeOS.height * 0.05,
            this.fakeOS.colors.ui.UIBarsColor,
            1.0
        ).setOrigin(0).setDepth(1000).setInteractive();

        this.fakeOS.log('Creating bottom bar');
        this.elements.bottomBar = this.fakeOS.add.rectangle(
            0,
            this.fakeOS.height - this.fakeOS.height * 0.1,
            this.fakeOS.width,
            this.fakeOS.height * 0.1,
            this.fakeOS.colors.ui.UIBarsColor,
          1.0
        ).setOrigin(0).setDepth(1000).setInteractive();

        this.container?.add(this.elements.topBar);
        this.container?.add(this.elements.bottomBar);
    }

    /**
     * Adds the UI main buttons.
     */
     protected createButtons(): void {
        this.fakeOS.log('Creating back button');
        let t = this;

        // Create home button
        this.elements.homeButton = this.fakeOS.add.image(
            this.fakeOS.width / 2,
            this.fakeOS.height - this.fakeOS.height * 0.05,
            'button-homescreen'
        ).setInteractive()
        .setOrigin(0.5, 0.5)
        .setDepth(1001);

        // Create back button
        this.elements.backButton = this.fakeOS.add.image(
            this.fakeOS.width / 4,
            this.fakeOS.height - this.fakeOS.height * 0.05,
            'back-button'
        ).setVisible(false)
        .setDepth(1001);

        this.container?.add(this.elements.homeButton);
        this.container?.add(this.elements.backButton);
    }

    /**
     * Creates the clock at the top bar.
     */
    protected createClock(): void {
        this.fakeOS.log('Creating clock');
        this.elements.clock = new Time(
            this.fakeOS,
            this.fakeOS.width / 2,
            this.fakeOS.height * 0.025,
            {
                fontFamily: 'Roboto',
                fontSize : 32,
                color: '#ffffff',
                align: 'center'
            }
        ).setOrigin(0.5, 0.5).setDepth(1001);

        this.container?.add(this.elements.clock);
    }

    /**
     * Creates the drawer.
     */
    protected createDrawer(): void {
        this.fakeOS.log('Creating drawer');
        this.elements.drawer = new NotificationDrawer(this.fakeOS, 0, 0).setDepth(1001);
        this.elements.drawer.refreshNotifications();

        this.container?.add(this.elements.drawer);
    }

    /**
     * Adds event listeners.
     */
    public addEventListeners(): void {
        this.fakeOS.addEventListener(
            PhoneEvents.ActivityFinished,
            () => {
                this.fakeOS.log('Refreshing notifications');
                this.fakeOS.checkNew();
                this.elements.drawer?.refreshNotifications();
            }
        );

        this.fakeOS.addEventListener(
            PhoneEvents.NotificationLaunched,
            (notification: any) => {
                this.fakeOS.log('Launching notification ' + notification.id + ':' + notification.title);
                this.elements.drawer?.launchNotification(notification);
            }
        );

        this.fakeOS.addEventListener(
            PhoneEvents.NotificationClicked,
            (notification: any) => {
                let app = notification.type.charAt(0).toUpperCase() + notification.type.slice(1) + 'App';
                this.fakeOS.log('Clicked notification of type: ' + notification.type);
                this.elements.drawer?.hideDrawer();
                this.fakeOS.launchApp(app);
                this.fakeOS.getActiveApp().goToID(notification.id);
            }
        );

        this.fakeOS.addEventListener(
            PhoneEvents.NotificationFinished,
            () => {
                setTimeout(() => {
                    if (this.elements.drawer !== undefined) {
                        this.elements.drawer.isNotificationYoyoing = false;
                    }
                }, 1000);
            }
        );
    }

    /**
     * Adds UI input listeners.
     */
    public addInputListeners(): void {
        this.fakeOS.addInputEvent(
            'pointerup',
            () => this.fakeOS.launchApp('HomescreenApp'),
            this.elements.homeButton
        );

        this.fakeOS.addInputEvent(
            'pointerup',
            () => this.fakeOS.useBackFunction(),
            this.elements.backButton
        );

        this.elements.drawer?.addEvents();
    }

    /**
     * Updates the UI.
     *
     * @param delta
     * @param time
     */
    public update(delta:any, time: any): void {
        this.elements.clock.update(delta);
        this.elements.drawer?.update(delta);

        // Only showing back button when functions available.
        if (this.fakeOS.getBackFunction().length > 0) {
            this.elements.backButton.setVisible(true);
        } else {
            this.elements.backButton.setVisible(false);
        }
    }
}