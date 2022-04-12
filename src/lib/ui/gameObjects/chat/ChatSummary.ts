import { FakeOS } from '../../../../scenes/FakeOS';
/**
 * Chat summary.
 * @todo: review this.
 */
export default class ChatSummary extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;
    protected pic: Phaser.GameObjects.Image;
    protected contactName: Phaser.GameObjects.Text;
    protected lastMessage: Phaser.GameObjects.Text;
    protected background: Phaser.GameObjects.Rectangle;

    /**
     * Class constructor.
     *
     * @param scene
     * @param x
     * @param y
     * @param notification
     */
    public constructor(
        scene: FakeOS,
        x: number,
        y: number,
        contact: any,
        text: string,
        textOptions: any
    ) {
        super(scene, x, y, []);
        this.fakeOS = scene;

        this.setSize(
            this.fakeOS.getActiveApp().area.width,
            this.fakeOS.getActiveApp().rowHeight()
        );

        this.pic = this.fakeOS.add.image(
            - this.fakeOS.getActiveApp().area.width * 0.3,
            0,
            contact.id
        );
        this.background = this.fakeOS.add.rectangle(
            0, 0,
            this.fakeOS.getActiveApp().area.width - 2,
            this.fakeOS.getActiveApp().rowHeight()
        );
        this.background.setStrokeStyle(1, 0xffffff);

        this.contactName = this.fakeOS.add.text(
            - this.fakeOS.getActiveApp().area.width * 0.1,
            -this.pic.height / 6,
            contact.contactName,
            textOptions
        );
        this.lastMessage = this.fakeOS.add.text(
            - this.fakeOS.getActiveApp().area.width * 0.1,
            10,
            text,
            textOptions
        );
        this.add([this.background, this.pic, this.contactName, this.lastMessage]);

        this.fakeOS.addInputEvent('pointerover', () => { this.pic.setTint(0x00cc00)}, this);
        this.fakeOS.addInputEvent('pointerout', () => { this.pic.clearTint()}, this);
    }
}