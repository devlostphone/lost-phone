import { FakeOS } from '../../../../scenes/FakeOS';

/**
 * Chat top bar.
 * @todo: review this.
 */
export default class ChatTopBar extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;
    protected background: Phaser.GameObjects.Rectangle;
    protected pic?: Phaser.GameObjects.Image;
    protected chatName: Phaser.GameObjects.Text;

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
        contact: any
    ) {
        super(scene, x, y, []);
        this.fakeOS = scene;
        this.setDepth(-10000);

        // Add simple background
        this.background = this.fakeOS.add.rectangle(
            80, 16, // x, y
            this.fakeOS.getActiveApp().area.width, 96, // width, height
            0xffffff);
        this.background.setFillStyle(0x0, 0.5);

        this.add(this.background);

        // Create avatar
        if (contact.contactPic != null) {
            let avatar_x = - this.fakeOS.getActiveApp().area.width * 0.3;
            this.pic = this.fakeOS.add.image(avatar_x, 16, contact.id);
            // @TODO: this doesn't affect the scale of profile picture
            this.pic.setScale(0.75);
            this.add(this.pic);
        }

        this.chatName = this.fakeOS.add.text(-150,0,contact.contactName,{
            fontSize: "28px",
            align: "left",
            color: '#fff',
            fontFamily: 'Roboto-Bold'
        });
        this.add(this.chatName);
    }
}
