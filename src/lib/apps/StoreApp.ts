import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';
import AppInfoBox from '../ui/gameObjects/store/AppInfoBox';

/**
 * Store app
 */
export default class StoreApp extends App {

    protected apps: any;

    /**
     * Class constructor.
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS, {rows: 4});
        this.apps = this.fakeOS.cache.json.get('apps');
    }

    /**
     * @inheritdoc
     */
    public render() {
        this.getActiveLayer().clear();
        this.setBackground();
        for (let i = 0; i < this.apps.length; i++) {
            if (this.apps[i].store) {
                let info_box = new AppInfoBox(this.fakeOS, 0, 0, this.apps[i]);
                this.addRow(info_box);
            }
        }
    }

    /**
     * Set app background
     */
    protected setBackground(image?: string): void {
        if (image !== undefined) {
            this.fakeOS.UI.setBackground(image);
        } else {
            let background = this.fakeOS.cache.json.get('apps').find((app: any) => app.key == 'StoreApp').background;
            console.log(background);
            this.fakeOS.UI.setBackground(background);
        }
    }

}
