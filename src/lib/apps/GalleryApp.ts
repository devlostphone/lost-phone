import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';
import PicGrid from '../../lib/ui/gameObjects/PicGrid';

/**
 * Gallery app
 */
export default class GalleryApp extends App {

    protected media: any;
    protected picGrid?: PicGrid;

    /**
     * Class constructor.
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.media = this.fakeOS.cache.json.get('gallery');
    }

    /**
     * @inheritdoc
     */
    public render(): void {
        this.getActiveLayer().clear();
        this.setBackground();
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
    public goToID(id: string, skipLayerChangeAnim = false): void {
        this.skipLayerChangeAnim = skipLayerChangeAnim;
        this.reRender();
        this.picGrid?.open(id);
    }

    /**
     * Set app background
     */
    protected setBackground(image?: string): void {
        if (image !== undefined) {
            this.fakeOS.UI.setBackground(image);
        } else {
            let background = this.fakeOS.cache.json.get('apps').find((app: any) => app.key == 'GalleryApp').background;
            this.fakeOS.UI.setBackground(background);
        }
    }
}
