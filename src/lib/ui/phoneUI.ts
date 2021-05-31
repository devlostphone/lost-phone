import { FakeOS } from 'scenes/FakeOS';
import Time from 'lib/ui/gameObjects/Time';

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
        homeButton?: any
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
        let t = this;
        this.elements.homeButton = this.fakeOS.add.image(
            this.fakeOS.width / 2,
            this.fakeOS.height - this.fakeOS.height * 0.05,
            'button-homescreen'
        ).setInteractive()
        .setOrigin(0.5, 0.5)
        .on('pointerup', () => t.fakeOS.launchApp('HomescreenApp'));
    }

    /**
     * Creates the clock at the top bar
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
     * Updates the UI.
     *
     * @param delta
     * @param time
     */
    public update(delta:any, time: any): void {
        this.elements.clock.update(delta);
    }
}