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
    protected dots: any;
    protected numericPad: any;

    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.password = this.fakeOS.cache.json.get('unlock-screen').password;

    }

    public render(): void {
        this.showDotsPIN();
        this.showNumericPad();
    }

    /**
     * Update method.
     *
     * @param delta
     * @param time
     */
    public update(delta: any, time: any): void {

    }

    protected showNumericPad(): void {
        let numericLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9','', '0'];
        let numericSubLabels = ['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ'];

        this.numericPad = this.fakeOS.add.container();
        for (let label of numericLabels) {
            let button: any;
            if (label == '1' || label == '0') {
                button = this.fakeOS.add.button('arc', label, 0, 0, { });
            } else {
                button = this.fakeOS.add.button('arc', label, 0, 0, { 'sublabel': numericSubLabels[Number(label) - 2]});
            }
            this.numericPad.add(button);
        }

        this.addGrid(this.numericPad.getAll(), {
            columns: 3,
            rows: 7,
            offsetY: 192
        });
    }

    protected showDotsPIN(): void {
        this.dots = this.fakeOS.add.container();
        for (let i = 0; i < 4; i++) {
            let dot = this.fakeOS.add.circle(0, 0, 12, 0x0);
            dot.setStrokeStyle(6, 0xffffff);
            this.dots.add(dot);
        }

        this.addGrid(this.dots.getAll(), {
            columns: 4,
            rows: 1
        });
    }
}