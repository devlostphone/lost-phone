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
            console.log(this.media[i]);
            let element = this.fakeOS.add.image(
                i % 2 == 0 ? 0 : renderArea.width / 2,
                renderArea.y + (renderArea.height / 4) * (Math.floor(i / 2)),
                this.media[i].id
            ).setOrigin(0,0);
            element.displayWidth = renderArea.width / 2;
            element.displayHeight = renderArea.height / 4;
        }

    }
}