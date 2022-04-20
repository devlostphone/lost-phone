import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';
import PicGrid from '../../lib/ui/gameObjects/PicGrid';

/**
 * Gallery app
 */
export default class GalleryApp extends App {

    protected media: any;
    protected picGrid?: PicGrid;

    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.media = this.fakeOS.cache.json.get('gallery');
    }

    /**
     * @inheritdoc
     */
    public render(): void {
        this.picGrid = new PicGrid(
            this.fakeOS,
            0, 0,
            this.media
        );
        this.fakeOS.add.existing(this.picGrid);
        this.addElements(this.picGrid);
    }

    /**
     * @inheritdoc
     */
    public goToID(id: string): void {
        this.picGrid?.open(id);
    }
}