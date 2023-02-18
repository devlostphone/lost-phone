import { FakeOS } from '../../../../scenes/FakeOS';

/**
 * Chat top bar.
 * @todo: review this.
 */
export default class ChatTopBar extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;
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

        // Create avatar
        if (contact.contactPic != null) {
            let avatar_x = - this.fakeOS.getActiveApp().area.width * 0.3;
            this.pic = this.fakeOS.add.image(avatar_x, 0, contact.contactPic).setDepth(2000);
            this.add(this.pic);
        }

        this.chatName = this.fakeOS.add.text(-130,0,contact.contactName);
        this.add(this.chatName);
    }
}