import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';
import BrowserGrid from '../../lib/ui/gameObjects/BrowserGrid';

/**
 * Orwell Browser App
 */
export default class OrwellApp extends App {

    protected sites: any;
    protected browserGrid?: BrowserGrid;
    
    /**
     * Class constructor.
     *
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.sites = this.fakeOS.cache.json.get('orwell');
    }

    /**
     * @inheritdoc
     */
    public render(): void {
        this.getActiveLayer().clear();

        this.browserGrid = new BrowserGrid(
            this.fakeOS,
            0, 0,
            this.sites
        );
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
