import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';
import SocialPost from '../ui/gameObjects/social/SocialPost';

/**
 * Lostagram app.
 */
export default class LostagramApp extends App {

    protected posts: any;

    /**
     * Class constructor.
     *
     * @param fakeOS FakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.posts = this.fakeOS.cache.json.get('lostagram');
    }

    /**
     * @inheritdoc
     */
    public render(): void {
        this.setBackground();
        this.showPosts();
    }

    public showPosts(): void {
        for (let i = 0; i < this.posts.length; i++) {
            this.addRow(new SocialPost(this.fakeOS, 0, 0, this.posts[i]));
        }
    }

    /**
     * Set app background
     */
    protected setBackground(image?: string): void {
        if (image !== undefined) {
            this.fakeOS.UI.setBackground(image);
        } else {
            let background = this.fakeOS.cache.json.get('apps').find(app => app.key == 'ChatApp').wallpaper;
            this.fakeOS.UI.setBackground(background);
        }
    }

}
