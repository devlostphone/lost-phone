// --- App icon
export default class AppIcon extends Phaser.GameObjects.Container
{
    public icon: Phaser.GameObjects.Image;
    public config: any;
    public balloon: any;

    constructor(
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

        this.init();
        this.config = appConfig;

        scene.add.existing(this);
    };

    init() {
        // --- Interaction with the icon
        let t = this;
        this.icon.on('pointerover', function(event: any) {
            t.setAlpha(0.7);
        });

        this.icon.on('pointerout', function(event: any) {
            t.setAlpha(1.0);
        });

        this.icon.on('pointerup', function(event:any) {
            if (t.scene.scene.isSleeping(t.config.key)) {
                t.scene.scene.wake(t.config.key);
            } else {
                t.scene.scene.launch(t.config.key);
            }
            t.scene.scene.sleep('Homescreen');
           // t.scene.scene.get('PhoneUI').homeButton.setVisible(true);
        });

    }

    addLabel(appname: string)
    {
        let label = this.scene.add.text(
            this.x,
            this.y + this.icon.displayHeight / 2 + 5,
            this.config.name
        );
        this.add(label);
        label.setOrigin(0.5, 0);
        // Set text depending on assetsDPR value
        label.setFontSize(32);
        label.setFontFamily('Roboto');
        label.setShadow(2, 2, '0x3f3f3f', 0.4);
        label.setResolution(1);

        return this;
    }

    addBalloon(counter: number) {
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
                25,
                25,
                0xff0000,
                1.0
            ).setOrigin(0.5, 0.5));

            this.balloon.add(new Phaser.GameObjects.Text(
                this.scene,
                0,
                0,
                counter.toString(),
                {
                    fontFamily: 'Roboto',
                    fontSize : '32',
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
