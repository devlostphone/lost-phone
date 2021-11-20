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
        let numericLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9','', '0'];
        let numericSubLabels = ['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ'];

        let numericPad = this.fakeOS.add.container();
        for (let label of numericLabels) {
            let button: any;
            if (label == '1' || label == '0') {
                button = this.fakeOS.add.button('arc', label, 0, 0, { });
            } else {
                button = this.fakeOS.add.button('arc', label, 0, 0, { 'sublabel': numericSubLabels[Number(label) - 2]});
            }
            numericPad.add(button);
        }

        this.addGrid(numericPad.getAll(),
            {
                columns: 3,
                rows: 7
            });
    }

    public render(): void {

    }
}