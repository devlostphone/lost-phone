import { FakeOS } from "../../../../scenes/FakeOS";

/**
 * Mail preview.
 * @todo: review this.
 */
export default class MailPreview extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;
    protected subject: Phaser.GameObjects.Text;
    protected background: Phaser.GameObjects.Rectangle;

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
        mail: any,
        textOptions?: any
    ){
        super(scene, x, y, []);
        this.fakeOS = scene;
        this.setSize(
            this.fakeOS.getActiveApp().area.width,
            this.fakeOS.getActiveApp().rowHeight()
        );
        this.subject = this.fakeOS.add.text(
            -this.fakeOS.getActiveApp().area.width / 2 + 32,
            32,
            mail.subject,
            textOptions
        );

        this.add([this.subject]);
    }
}
