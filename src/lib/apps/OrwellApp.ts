import { FakeOS } from '../../scenes/FakeOS';
import GalleryApp from './GalleryApp';
import PicGrid from '../../lib/ui/gameObjects/PicGrid';

/**
 * Orwell Browser App
 */
export default class OrwellApp extends GalleryApp {

    protected picGrid?: PicGrid;
    
    /**
     * Class constructor.
     *
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.media = this.fakeOS.cache.json.get('orwell');
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
        this.setBackground();
    }

    /**
     * Set app background
     */
    protected setBackground(image?: string): void {
        if (image !== undefined) {
            this.fakeOS.UI.setBackground(image);
        } else {
            let wallpaper = this.fakeOS.cache.json.get('apps').find((app: any) => app.key == 'OrwellApp').wallpaper;
            this.fakeOS.UI.setBackground(wallpaper);
        }
    }

}
