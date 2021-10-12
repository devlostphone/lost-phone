import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';

/**
 * Gallery app
 */
export default class GalleryApp extends App {

    protected multimedia: any;

    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.multimedia = this.fakeOS.cache.json.get('gallery');
    }

    public render(): void {
        console.log(this.multimedia);
    }
}