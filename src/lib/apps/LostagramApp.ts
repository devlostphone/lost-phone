import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';
import SocialPost from '../ui/gameObjects/social/SocialPost';

/**
 * Lostagram app.
 */
export default class LostagramApp extends App {

    protected posts: any;
    protected socialPosts: any;

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
        let socialPost;
        this.socialPosts = [];
        for (let i = 0; i < this.posts.length; i++) {
            socialPost = new SocialPost(this.fakeOS, 0, 0, this.posts[i]);
            this.socialPosts.push(socialPost);
            this.addRow(socialPost);
        }
    }

    /**
     * Set app background
     */
    protected setBackground(image?: string): void {
        if (image !== undefined) {
            this.fakeOS.UI.setBackground(image);
        } else {
            let background = this.fakeOS.cache.json.get('apps').find((app: any) => app.key == 'ChatApp').wallpaper;
            this.fakeOS.UI.setBackground(background);
        }
    }

    public goToID(id: string, skipLayerChangeAnim = false): void {
        for (let i=0; i<this.posts.length; i++) {
            if (this.socialPosts[i].id == id) {
                this.getActiveLayer().y = -this.socialPosts[i].y + 80;
                break;
            }
        }
    }

}
