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
    public author: Phaser.GameObjects.Text;
    public follow_link: Phaser.GameObjects.Text;
    public location: Phaser.GameObjects.Text;
    public social_bar: Phaser.GameObjects.Container;
    public likes: Phaser.GameObjects.Text;
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
            -this.fakeOS.getActiveApp().area.width / 2 + 30,
            this.background.getBounds().top,
            post['avatar']
        ).setOrigin(0, 0);
        this.avatar.displayWidth = this.fakeOS.getUI().getAppRenderSize().width / 10;
        this.avatar.scaleY = this.avatar.scaleX;

        this.author = this.fakeOS.add.text(
            this.avatar.getBounds().right + 20,
            this.background.getBounds().top,
            post['user'] + ' · ',
            this.textOptions
        );

        this.follow_link = this.fakeOS.add.text(
            this.author.getBounds().right + 10,
            this.background.getBounds().top,
            this.fakeOS.getString('follow'),
            {...this.textOptions, color: '#66AAFF'}
        );

        this.fakeOS.addInputEvent('pointerup', () => {
            this.follow_link.text = this.follow_link.text === this.fakeOS.getString('follow') ? this.fakeOS.getString('unfollow') : this.fakeOS.getString('follow');
        });

        this.location = this.fakeOS.add.text(
            this.avatar.getBounds().right + 20,
            this.author.getBounds().bottom + 10,
            post['location']
        );

        this.pic = this.fakeOS.add.image(
            0, this.avatar.getBounds().bottom + 20, post['pic']
        ).setDisplaySize(this.fakeOS.getActiveApp().area.width - 50, 600)
        .setOrigin(0.5, 0);

        this.social_bar = this.fakeOS.add.container(
            0,
            this.pic.getBounds().bottom + 30,
            []
        );

        this.social_bar.add([
            this.fakeOS.add.image(-this.fakeOS.getActiveApp().area.width / 2 + 40, 0,'heart-icon'),
            this.fakeOS.add.image(-this.fakeOS.getActiveApp().area.width / 2 + 90, 0, 'bubble-icon'),
            this.fakeOS.add.image(-this.fakeOS.getActiveApp().area.width / 2 + 140, 0, 'share-icon'),
            this.fakeOS.add.image(this.fakeOS.getActiveApp().area.width / 2 - 40, 0, 'bookmark-icon')
        ]);

        this.likes = this.fakeOS.add.text(
            -this.fakeOS.getActiveApp().area.width / 2 + 30,
            this.social_bar.getBounds().bottom + 10,
            post['likes'] + ' ' + this.fakeOS.getString('likes')
        );

        this.text = this.fakeOS.add.text(
            -this.fakeOS.getActiveApp().area.width / 2 + 30,
            this.likes.getBounds().bottom + 10,
            post['user'] + ' - ' + post['text'],
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
            this.avatar,
            this.author,
            this.follow_link,
            this.location,
            this.pic,
            this.social_bar,
            this.likes,
            this.text
        ]);

        for (let index = 0; index < this.comments.length; index++) {
            this.add(this.comments[index]);
        }
    }
}