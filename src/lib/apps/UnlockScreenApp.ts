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

        let arcButton1 = this.fakeOS.add.button('arc', '1', 96, 128, { });
        let arcButton2 = this.fakeOS.add.button('arc', '2', 96 * 2 + 72, 128, { 'sublabel': 'ABC' });
        let arcButton3 = this.fakeOS.add.button('arc', '3', 96 * 3 + (72 * 2), 128, { 'sublabel': 'DEF' });
        this.addElements([arcButton1, arcButton2, arcButton3]);
    }

    public render(): void {

    }
}