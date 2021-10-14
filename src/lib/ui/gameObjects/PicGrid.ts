import { FakeOS } from "scenes/FakeOS";

/**
 * Picture grid.
 * @todo: review this.
 */
export default class PicGrid extends Phaser.GameObjects.Container
{
    protected media: any;
    protected fakeOS: FakeOS;

    /**
     * Class constructor.
     *
     * @param scene
     * @param x
     * @param y
     * @param media
     */
     public constructor(
        scene: FakeOS,
        x: number, y: number,
        media: any
    ){
        super(scene, x, y, []);
        this.media = media;
        this.fakeOS = scene;

        this.printMedia();
    }

    public printMedia(): void {
        console.log(this.media);
        let renderArea = this.fakeOS.getUI().getAppRenderSize();
        for (let i = 0; i < this.media.length; i++) {
            let element = this.fakeOS.add.image(
                i % 2 == 0 ? 0 : renderArea.width / 2,
                renderArea.y + (renderArea.height / 4) * (Math.floor(i / 2)),
                this.media[i].id
            ).setOrigin(0,0);
            element.displayWidth = renderArea.width / 2;
            element.displayHeight = renderArea.height / 4;

            this.fakeOS.addInputEvent(
                'pointerdown',
                () => {
                    element.setTint(185273);
                },
                element
            );

            this.fakeOS.addInputEvent(
                'pointerout',
                () => {
                    element.clearTint();
                },
                element
            );

            this.fakeOS.addInputEvent(
                'pointerup',
                () => {
                    this.openMedia(element);
                    element.clearTint();
                },
                element
            );

            this.add(element);
        }
    }

    public openMedia(element: Phaser.GameObjects.Image): void {
        this.fakeOS.getActiveApp().addLayer();
        let dimensions = this.fakeOS.getUI().getAppRenderSize();

        element.displayWidth = dimensions.width;
        element.displayHeight = dimensions.height / 2;
        element.setX(0).setY(this.fakeOS.height / 2).setOrigin(0,0.5);
        this.fakeOS.add.existing(element);

        this.fakeOS.addBackFunction(() => {
            this.fakeOS.launchApp(this.fakeOS.getActiveApp().getKey());
        });
    }
}