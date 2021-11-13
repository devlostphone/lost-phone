import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';
import Button from '~/lib/ui/gameObjects/Button';

/**
 * Unlock Screen app
 */

export default class UnlockScreenApp extends App {

    protected message: string;
    protected pin: string;
    protected password: string;

    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.password = this.fakeOS.cache.json.get('unlock-screen').password;
        console.log(this.password);

        let button = this.fakeOS.add.button('rect', 'button', 0, 0, {});
    }

    public render(): void {

    }
}