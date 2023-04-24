import { FakeOS } from '../../scenes/FakeOS';
import Time from './gameObjects/Time';
import NotificationDrawer from './gameObjects/notifications/NotificationDrawer';
import { PhoneEvents } from '../events/GameEvents';

interface UIElements {
    topBar: any,
    bottomBar: any,
    signal: any,
    clock: any,
    homeButton: any,
    backButton: any,
    drawer: any
}

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
    public elements: UIElements;

    /**
     * Fixed containers, to be removed after changing layers or launching apps.
     */
    public fixedElements?: Phaser.GameObjects.Container;

    /**
     * Container game object with all UI game objects.
     */
    public container: any;

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
        this.elements = {
            topBar: null,
            bottomBar: null,
            signal: null,
            operator: null,
            wifi: null,
            battery: null,
            clock: null,
            homeButton: null,
            backButton: null,
            drawer: null
        };
        this.isDrawerOpen = false;
    }

    /**
     * Renders the UI.
     */
    public render(): void {
        this.fakeOS.log('Loading UI');
        this.container = this.fakeOS.add.container(0,0).setDepth(1000);
        this.fixedElements = this.fakeOS.add.container(0,0).setDepth(2000);
        this.createBars();
        this.createButtons();
        this.createSignal();
        this.createOperatorProvider();
        this.createWiFi();
        this.createBattery();
        this.createPecentageBatteryNumber();
        this.createClock();
        this.createDrawer();
        this.setBackground('dramatic-wallpaper');

        this.fakeOS.log('Setting up UI listeners');
        this.addEventListeners();
        this.addInputListeners();
        this.applyMask();
    }

    /**
     * @TODO
     */
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
        this.container.setMask(mask);
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
     * Sets the default FakeOS background defined at App settings
     */
    
    // @TODO: Set background depending on gpu capabilites client: canvas or webgl.
    public setBackground(expr: string): void {
        let keyTexture;
        let background;
        let arrObjects = this.fakeOS.children.getChildren();

        switch (expr) {
            case 'solid':
                let hours = new Date().getHours();
                if ( hours >= 9 && hours < 19 ) {
                    keyTexture = 'solid-light-grey-background';
                } else {
                    keyTexture = 'solid-dark-grey-background';
                }
                break;
            case 'shader':
                console.log("[WARNING]: Shader as App background not implemented");
                break;
                // const rt = this.fakeOS.make.renderTexture({ width: 1242, height: 2209 }, false);
                // rt.fill(0xff00ff, 1, 0, 0, 1242, 2209);
                // rt.draw(this.fakeOS.cache.json.get('config')['background'] + '-background', 0, 0);
                // rt.saveTexture('rt');

                // const shader = this.fakeOS.add.shader('Pointillize Filter', 0, 0, 1242, 2209, ['noise', 'rt']);
                // shader.setOrigin(0);
                // shader.setScale(
                //     this.fakeOS.width / shader.width,
                //     this.fakeOS.height / shader.height
                // );
            default:
                keyTexture = expr + '-background';
                // @TODO: Handle not found images
                // console.log(`Sorry, no background well defined: ${expr}`);
                break;
        }

        let img = arrObjects.filter(obj => obj.type == "Image").find(image => image.texture.key != "background");
        if (img == undefined) {
            background = this.fakeOS.add.image(0, 0, keyTexture, 0).setOrigin(0, 0);
            background.setScale(
                this.fakeOS.width / background.width,
                this.fakeOS.height / background.height
            );
        } else {
            img.setTexture(keyTexture).setScale(
                this.fakeOS.width / img.width,
                this.fakeOS.height / img.height
            );
        }
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
            '#000',
            1.0
        ).setOrigin(0).setDepth(1000).setInteractive();

        this.fakeOS.log('Creating bottom bar');
        this.elements.bottomBar = this.fakeOS.add.rectangle(
            0,
            this.fakeOS.height - this.fakeOS.height * 0.1,
            this.fakeOS.width,
            this.fakeOS.height * 0.1,
            '#000',
          1.0
        ).setOrigin(0).setDepth(1000).setInteractive();

        this.container.add(this.elements.topBar);
        this.container.add(this.elements.bottomBar);
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

        this.container.add(this.elements.homeButton);
        this.container.add(this.elements.backButton);
    }

    /**
     * Creates the signal icon at the left-top bar.
     */
    protected createSignal(): void {
        this.fakeOS.log("Creating signal icon");
        this.elements.signal = this.fakeOS.add.image(
            this.fakeOS.width * 0.028,
            this.fakeOS.height * 0.025,
            'signal'
        ).setOrigin(0.5).setDepth(1001);        
        this.container.add(this.elements.signal);
    }

    /**
     * Adds operator name at the left-top bar.
     */
    protected createOperatorProvider(): void {
        this.fakeOS.log("Add operator provider name");
        this.elements.operator = this.fakeOS.add.text(
            this.fakeOS.width * 0.125,
            this.fakeOS.height * 0.025,
            'IOCtel+',
            {
                fontFamily: 'RobotoCondensed',
                fontSize : 28,
                color: '#ffffff',
                align: 'left'
            }
        ).setOrigin(0.5).setDepth(1001);
        this.container.add(this.elements.operator);
    }

    /**
     * Creates the wifi icon at the left-top bar.
     */
    protected createWiFi(): void {
        this.fakeOS.log("Creating signal icon");
        this.elements.wifi = this.fakeOS.add.image(
            this.fakeOS.width * 0.22,
            this.fakeOS.height * 0.025,
            'wifi'
        ).setOrigin(0.5).setDepth(1001);        
        this.container.add(this.elements.wifi);
    }

    /**
     * Creates the battery icon at the right-top bar.
     */
    protected createBattery(): void {
        this.fakeOS.log("Creating battery icon");
        this.elements.battery = this.fakeOS.add.image(
            this.fakeOS.width * 0.89,
            this.fakeOS.height * 0.025,
            'battery'
        ).setOrigin(0.5).setDepth(1001);        
        this.container.add(this.elements.battery);
    }

    /**
     * Adds battery percentage number at the right-top bar
     */
    protected createPecentageBatteryNumber(): void {
        this.fakeOS.log("Add percentage battery number");
        this.elements.percentage = this.fakeOS.add.text(
            this.fakeOS.width * 0.82,
            this.fakeOS.height * 0.025,
            '23%',
            {
                fontFamily: 'RobotoCondensed',
                fontSize : 28,
                color: '#ffffff',
                align: 'left'
            }
        ).setOrigin(0.5).setDepth(1001);
        this.container.add(this.elements.percentage);
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
                fontFamily: 'RobotoCondensed',
                fontSize : 28,
                color: '#ffffff',
                align: 'center'
            }
        ).setOrigin(0.5, 0.5).setDepth(1001);

        this.container.add(this.elements.clock);
    }

    /**
     * Creates the drawer.
     */
    protected createDrawer(): void {
        this.fakeOS.log('Creating drawer');
        this.elements.drawer = new NotificationDrawer(this.fakeOS, 0, 0).setDepth(1001);
        this.elements.drawer.refreshNotifications();

        this.container.add(this.elements.drawer);
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
                this.elements.drawer.refreshNotifications();
                this.elements.drawer.update_notification_counter();
            }
        );

        this.fakeOS.addEventListener(
            PhoneEvents.NotificationLaunched,
            (notification: any) => {
                this.fakeOS.log('Launching notification ' + notification.id + ':' + notification.title);
                this.elements.drawer.launchNotification(notification);
            }
        );

        this.fakeOS.addEventListener(
            PhoneEvents.NotificationClicked,
            (notification: any) => {
                let app = notification.type.charAt(0).toUpperCase() + notification.type.slice(1) + 'App';
                this.fakeOS.log('Clicked notification of type: ' + notification.type);
                this.elements.drawer.hideDrawer();
                this.fakeOS.launchApp(app);
                this.fakeOS.getActiveApp().goToID(notification.id);
            }
        );

        this.fakeOS.addEventListener(
            PhoneEvents.NotificationFinished,
            () => {
                if (this.elements.drawer !== undefined) {
                    setTimeout(() => {
                        if (this.elements.drawer !== undefined) {
                            this.elements.drawer.isNotificationYoyoing = false;
                        }
                    }, 1000);

                    this.elements.drawer.update_notification_counter();
                }
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

        this.elements.drawer.addEvents();
    }

    /**
     * Updates the UI.
     *
     * @param delta
     * @param time
     */
    public update(delta:any, time: any): void {
        this.elements.clock.update(delta);
        this.elements.drawer.update(delta);

        // Only showing back button when functions available.
        if (this.fakeOS.getBackFunction().length > 0) {
            this.elements.backButton.setVisible(true);
        } else {
            this.elements.backButton.setVisible(false);
        }
    }
}
