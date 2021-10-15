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

    /**
     * Prints media collection from the gallery.
     *
     */
    public printMedia(): void {
        let renderArea = this.fakeOS.getUI().getAppRenderSize();
        for (let i = 0; i < this.media.length; i++) {
            let element = this.fakeOS.add.image(
                0,
                0,
                this.media[i].id
            );
            element.displayWidth = renderArea.width / 2;
            element.displayHeight = renderArea.height / 4;

            this.add(element);
            this.fakeOS.addInputEvent(
                'pointerup',
                () => {
                    element.setTint(185273);
                    setTimeout(() => {
                        element.clearTint();
                        this.openMedia(element);
                    }, 100);
                },
                element
            );
        }

        let elements = this.getAll();

        this.fakeOS.getActiveApp().addGrid(
            elements,
            {
                columns: 2,
                rows: 4
            });
    }

    /**
     * Opens a media element from the gallery.
     * @TODO: add video
     *
     * @param element
     */
    public openMedia(element: Phaser.GameObjects.Image): void {
        this.fakeOS.getActiveApp().addLayer(0x333333);
        const dimensions = this.fakeOS.getUI().getAppRenderSize();

        element.displayWidth = dimensions.width;
        element.displayHeight = dimensions.height / 2;
        element.setX(0).setY(this.fakeOS.height / 2).setOrigin(0,0.5);
        this.fakeOS.add.existing(element);

        this.fakeOS.addBackFunction(() => {
            this.fakeOS.launchApp(this.fakeOS.getActiveApp().getKey());
        });
    }
}