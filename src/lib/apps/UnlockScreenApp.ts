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

        let button1 = this.fakeOS.add.button('arc', '1', 0, 128, {});
        let button2 = this.fakeOS.add.button('rect', '2', 0, 256, {});
        this.addElements([button1, button2]);
    }

    public render(): void {

    }
}