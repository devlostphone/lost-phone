import { FakeOS } from '~/scenes/FakeOS';
import Time from '~/lib/ui/gameObjects/Time';
import { width } from '../Screen';

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
        drawer?: any
    };

    /**
     * Class constructor.
     *
     * @param fakeOS FakeOS
     */
    public constructor(fakeOS: FakeOS) {
        this.fakeOS = fakeOS;
        this.elements = {};
    }

    /**
     * Renders the UI.
     */
    public render(): void {
        this.fakeOS.log('Loading UI');
        this.setWallpaper();
        this.createBars();
        this.createButtons();
        this.createClock();
        this.createDrawer();
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
        ).setOrigin(0);

        this.fakeOS.log('Creating bottom bar');
        this.elements.bottomBar = this.fakeOS.add.rectangle(
            0,
            this.fakeOS.height - this.fakeOS.height * 0.1,
            this.fakeOS.width,
            this.fakeOS.height * 0.1,
            this.fakeOS.colors.ui.UIBarsColor,
          1.0
        ).setOrigin(0);
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
        .setOrigin(0.5, 0.5);

        this.fakeOS.addInputEvent(
            'pointerup',
            () => t.fakeOS.launchApp('HomescreenApp'),
            this.elements.homeButton
        );

        // Create back button
        this.elements.backButton = this.fakeOS.add.text(
            this.fakeOS.width / 4,
            this.fakeOS.height - this.fakeOS.height * 0.05,
            '<-'
        ).setVisible(false);

        this.fakeOS.addInputEvent(
            'pointerup',
            () => t.fakeOS.useBackFunction(),
            this.elements.backButton
        );
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
        ).setOrigin(0.5, 0.5);
    }

    /**
     * Creates the drawer.
     */
    protected createDrawer(): void {
        this.fakeOS.log('Creating drawer');
        this.elements.drawer = {};

        // Create drawer area, off camera
        this.elements.drawer.drawerArea = this.fakeOS.add.container(
            0, -this.fakeOS.height
        ).setDepth(100)
        .setSize(this.fakeOS.width,this.fakeOS.height);

        this.elements.drawer.drawerBox = this.fakeOS.add.rectangle(
            0, 0,
            this.fakeOS.width, this.fakeOS.height,
            0x333333
        ).setOrigin(0,0);

        // Stops events from going below the box
        this.fakeOS.addInputEvent(
            'pointerup',
            () => {},
            this.elements.drawer.drawerBox
        );

        this.elements.drawer.drawerArea.add(this.elements.drawer.drawerBox);

        // Create drawer launcher
        this.elements.drawer.drawerLauncher = this.fakeOS.add.polygon(
            this.fakeOS.width - 50,
            this.fakeOS.height,
            [
                [0,0],
                [0, this.elements.topBar.height],
                [25, this.elements.topBar.height + 25],
                [50, this.elements.topBar.height],
                [50, 0]
            ],
            0x333333
        ).setOrigin(0,0);

        this.fakeOS.addInputEvent(
            'pointerup',
            () => {
                this.fakeOS.log('Launching drawer');
                this.fakeOS.tweens.add({
                    targets: this.elements.drawer.drawerArea,
                    y: 0,
                    duration: 700
                });
            },
            this.elements.drawer.drawerLauncher
        );
        this.fakeOS.addInputEvent(
            'pointerover',
            () => {
                this.elements.drawer.drawerLauncher.setFillStyle(0x666666)
            },
            this.elements.drawer.drawerLauncher
        );
        this.fakeOS.addInputEvent(
            'pointerout',
            () => {
                this.elements.drawer.drawerLauncher.setFillStyle(0x333333)
            },
            this.elements.drawer.drawerLauncher
        );

        this.elements.drawer.drawerArea.add(this.elements.drawer.drawerLauncher);

        // Create drawer hide button
        this.elements.drawer.drawerHide = this.fakeOS.add.polygon(
            this.fakeOS.width - 50,
            this.fakeOS.height - this.elements.topBar.height - 25,
            [
                [0, this.elements.topBar.height + 25],
                [0, 25],
                [25, 0],
                [50, 25],
                [50, this.elements.topBar.height + 25]
            ],
            0xcccccc
        ).setOrigin(0,0);

        this.fakeOS.addInputEvent(
            'pointerup',
            () => {
                this.fakeOS.log('Hiding drawer');
                this.fakeOS.tweens.add({
                    targets: this.elements.drawer.drawerArea,
                    y: -this.fakeOS.height,
                    duration: 700
                });
            },
            this.elements.drawer.drawerHide
        );
        this.fakeOS.addInputEvent(
            'pointerover',
            () => {
                this.elements.drawer.drawerHide.setFillStyle(0x999999)
            },
            this.elements.drawer.drawerHide
        );
        this.fakeOS.addInputEvent(
            'pointerout',
            () => {
                this.elements.drawer.drawerHide.setFillStyle(0xcccccc)
            },
            this.elements.drawer.drawerHide
        );

        this.elements.drawer.drawerArea.add(this.elements.drawer.drawerHide);
    }

    /**
     * Updates the UI.
     *
     * @param delta
     * @param time
     */
    public update(delta:any, time: any): void {
        this.elements.clock.update(delta);

        // Only showing back button when functions available.
        if (this.fakeOS.getBackFunction().length > 0) {
            this.elements.backButton.setVisible(true);
        } else {
            this.elements.backButton.setVisible(false);
        }
    }
}