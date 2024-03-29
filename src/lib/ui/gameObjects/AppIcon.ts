/**
 * App icon.
 * @todo: review this.
 */
export default class AppIcon extends Phaser.GameObjects.Container
{
    /**
     * The icon image.
     */
    public icon: Phaser.GameObjects.Image;

    /**
     * Icon label.
     */
    public label?: Phaser.GameObjects.Text;

    /**
     * Config.
     */
    public config: any;

    /**
     * The notification balloon.
     */
    public balloon: any;

    /**
     * Class constructor.
     *
     * @param scene
     * @param appConfig
     * @param x
     * @param y
     * @param texture
     * @param frame
     */
    public constructor(
        scene: Phaser.Scene,
        appConfig: any,
        x: number, y: number,
        texture: any,
        frame?: any
    ){
        super(scene, x, y, []);

        this.icon = new Phaser.GameObjects.Image(
            scene,
            x,y,
            texture,
            frame
        ).setInteractive();
        this.add(this.icon);

        this.config = appConfig;

        scene.add.existing(this);
    };

    /**
     * Adds a label below the icon.
     *
     * @returns This object for chaining.
     */
    public addLabel(text: string): AppIcon {
        let label = this.scene.add.text(
            this.x,
            this.y + this.icon.displayHeight / 2 + 5,
            text
        );
        this.add(label);
        label.setOrigin(0.5, 0);
        // Set text depending on assetsDPR value
        label.setFontSize(24);
        label.setFontFamily('RobotoCondensed');
        label.setShadow(2, 2, '0x3f3f3f', 0.4);
        label.setResolution(1);

        this.label = label;

        return this;
    }

    /**
     * Adds a balloon notification with the specified number.
     *
     * @param counter   The number of notifications.
     * @returns This object for chaining.
     */
    public addBalloon(counter: number): AppIcon {
        let offset = 5;

        if (this.balloon !== undefined) {
            this.balloon.destroy();
        }

        if (counter > 0) {
            this.balloon = new Phaser.GameObjects.Container(
                this.scene,
                this.icon.displayWidth/2 - offset,
                - this.icon.displayHeight/2 + offset
            );

            this.balloon.add(new Phaser.GameObjects.Ellipse(
                this.scene,
                0,
                0,
                50,
                50,
                0xff0000,
                1.0
            ).setOrigin(0.5, 0.5));

            this.balloon.add(new Phaser.GameObjects.Text(
                this.scene,
                0,
                0,
                counter.toString(),
                {
                    fontFamily: 'RobotoCondensed',
                    fontSize : '32px',
                    color: '#ffffff',
                    align: 'center'
                }
                )
                .setOrigin(0.5, 0.5)
                .setShadow(2, 2, '0x3f3f3f', 0.4)
                .setResolution(1)
            );

            this.add(this.balloon);
        }

        return this;
    }
}
