import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';

/**
 * Phone app.
 */
 export default class PhoneApp extends App {

    /**
     * Class constructor.
     *
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
    }

    /**
     * Renders the app.
     */
    public render(): void {

    }
}
