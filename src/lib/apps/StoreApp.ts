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

        for (let i = 0; i < this.apps.length; i++) {
            let info_box = new AppInfoBox(this.fakeOS, 0, 0, this.apps[i]);
            this.addRow(info_box);
        }
    }
}