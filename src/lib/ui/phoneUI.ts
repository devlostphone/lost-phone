import FakeOS from 'scenes/FakeOS';
import Time from 'lib/ui/gameObjects/Time';

/**
 * FakeOS UI.
 */
export default class phoneUI {

    /**
     * FakeOS
     */
    public scene: FakeOS;

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
     * @param scene FakeOS
     */
    public constructor(scene: FakeOS) {
        this.scene = scene;
        this.elements = {};
    }

    /**
     * Renders the UI.
     */
    public render(): void {
        this.scene.log('Loading UI');
        this.setWallpaper();
        this.createBars();
        this.createButtons();
        this.createClock();
    }

    /**
     * Sets the FakeOS wallpaper.
     */
    protected setWallpaper(): void {
        let wallpapers = this.scene.cache.json.get('config').wallpapers;
        let wallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)] + '-wallpaper';
        let scale = this.scene.textures.get(wallpaper).getSourceImage();
        this.scene.add.image(
            Math.round(this.scene.width / 2),
            Math.round(this.scene.height / 2),
            wallpaper)
        .setOrigin(0.5, 0.5)
        .setScale(
            this.scene.width / scale.width,
            this.scene.height / scale.height
        );
    }

    /**
     * Creates the top and bottom bars.
     */
    protected createBars(): void {
        this.scene.log('Creating top bar');
        // Display top and bottom bars
        this.elements.topBar = this.scene.add.rectangle(
            0,
            0,
            this.scene.width,
            this.scene.height * 0.05,
            this.scene.colors.ui.UIBarsColor,
            1.0
        ).setOrigin(0);

        this.scene.log('Creating bottom bar');
        this.elements.bottomBar = this.scene.add.rectangle(
            0,
            this.scene.height - this.scene.height * 0.1,
            this.scene.width,
            this.scene.height * 0.1,
            this.scene.colors.ui.UIBarsColor,
          1.0
        ).setOrigin(0);
    }

    /**
     * Adds the UI main buttons.
     */
     protected createButtons(): void {
        let t = this;
        this.elements.homeButton = this.scene.add.image(
            this.scene.width / 2,
            this.scene.height - this.scene.height * 0.05,
            'button-homescreen'
        ).setInteractive()
        .setOrigin(0.5, 0.5)
        .on('pointerup', () => t.scene.launchApp('HomescreenApp'));
    }

    /**
     * Creates the clock at the top bar
     */
    protected createClock(): void {
        this.scene.log('Creating clock');
        this.elements.clock = new Time(
            this.scene,
            this.scene.width / 2,
            this.scene.height * 0.025,
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