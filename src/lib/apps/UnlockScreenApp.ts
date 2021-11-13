import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';

/**
 * Unlock Screen app
 */

export default class UnlockScreenApp extends App {

    protected message: String;
    protected pin: String;
    protected password: String;

    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.password = this.fakeOS.cache.json.get('unlock-screen').password;
        console.log(this.password);
    }

    public render(): void {

    }
}