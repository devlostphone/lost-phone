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
            this.pic = this.fakeOS.add.image(avatar_x, 11, contact.contactPic);
            // @TODO: this doesn't affect the scale of profile picture
            this.pic.setScale(1);
            this.add(this.pic);
        }

        this.chatName = this.fakeOS.add.text(-160,0,contact.contactName,{fontSize: "20px"});
        this.add(this.chatName);
    }
}
