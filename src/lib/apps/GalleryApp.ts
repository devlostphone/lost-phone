import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';
import PicGrid from '../../lib/ui/gameObjects/PicGrid';

/**
 * Gallery app
 */
export default class GalleryApp extends App {

    protected media: any;

    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.media = this.fakeOS.cache.json.get('gallery');
    }

    public render(): void {
        let picGrid = new PicGrid(
            this.fakeOS,
            0, 0,
            this.media
        );
        this.fakeOS.add.existing(picGrid);
        this.addElements(picGrid);
    }
}