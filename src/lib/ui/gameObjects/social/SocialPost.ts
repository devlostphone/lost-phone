import { PhoneEvents } from '../../../../lib/events/GameEvents';
import { FakeOS } from '../../../../scenes/FakeOS';
/**
 * Social post.
 * @todo: review this.
 */
export default class SocialPost extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;
    protected textOptions: any;
    protected commentOptions: any;

    public background: Phaser.GameObjects.Rectangle;
    public pic: Phaser.GameObjects.Image;
    public text: Phaser.GameObjects.Text;
    public avatar: Phaser.GameObjects.Image;
    public comments: any = [];

    /**
     * Class constructor.
     *
     * @param scene
     * @param x
     * @param y
     * @param post
     */
    public constructor(
        scene: FakeOS,
        x: number,
        y: number,
        post: any
    ) {
        super(scene, x, y, []);
        this.fakeOS = scene;

        this.textOptions = {
            fontSize: "24px",
            align: "left",
            wordWrap: { width: this.fakeOS.width - 50, useAdvancedWrap: true }
        };

        this.commentOptions = {
            fontSize: "24px",
            align: "left",
            wordWrap: { width: this.fakeOS.width - 110, useAdvancedWrap: true }
        };

        this.background = this.fakeOS.add.rectangle(
            0, 0, this.fakeOS.getActiveApp().area.width
        );
        this.avatar = this.fakeOS.add.image(
            -this.fakeOS.getActiveApp().area.width / 2,
            this.background.getBounds().top,
            post['avatar']
        ).setOrigin(0, 0);

        this.pic = this.fakeOS.add.image(
            0, this.avatar.getBounds().bottom - this.avatar.height * 0.6, post['pic']
        ).setDisplaySize(this.fakeOS.getActiveApp().area.width - 50, 600)
        .setOrigin(0.5, 0);

        this.text = this.fakeOS.add.text(
            -this.fakeOS.getActiveApp().area.width / 2 + 30,
            this.pic.getBounds().bottom + 10, post['user'] + ' - ' + post['text'],
            this.textOptions
        ).setOrigin(0, 0);

        let last_position = this.text.getBounds().bottom + 10;
        let comment;
        for (let index = 0; index < post['comments'].length; index++) {
            comment = this.fakeOS.add.text(
                -this.fakeOS.getActiveApp().area.width / 2 + 60,last_position,
                ' · ' + post['comments'][index]['user'] + ': ' + post['comments'][index]['comment'],
                this.commentOptions
            ).setOrigin(0, 0);
            this.comments.push(comment);
            last_position = comment.getBounds().bottom + 10;
        }

        this.background.y = last_position + 20;

        this.add([
            this.background,
            this.pic,
            this.avatar,
            this.text
        ]);

        for (let index = 0; index < this.comments.length; index++) {
            this.add(this.comments[index]);
        }
    }
}