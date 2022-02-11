import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';

/**
 * Unlock Screen app
 */

export default class UnlockScreenApp extends App {

    protected message?: Phaser.GameObjects.Text;
    protected pin?: string;
    protected password: string;
    protected dots: any;
    protected numericPad: any;
    protected enterCode: string;

    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.password = this.fakeOS.cache.json.get('unlock-screen').password;
        this.enterCode = "";

        // Hide home button and back button
        this.fakeOS.getUI().hideHomeButton();
    }

    public render(): void {
        this.showMessage();
        this.showDotsPIN();
        this.showNumericPad();
    }

    /**
     * Update method.
     *
     * @param delta
     * @param time
     */
    public update(delta: any, time: any): void { }

    protected showNumericPad(): void {
        let numericLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9','', '0'];
        let numericSubLabels = ['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ'];

        this.numericPad = this.fakeOS.add.container();
        for (let label of numericLabels) {
            let button: any;
            if (label == '1' || label == '0') {
                button = this.fakeOS.add.button('arc', 'large', label, 0, 0, { });
            } else {
                button = this.fakeOS.add.button('arc', 'large', label, 0, 0, { 'sublabel': numericSubLabels[Number(label) - 2]});
            }

            // REMEMBER: 72 is the half value of rect/arc/capsule dimension (144)
            // TODO: Fix undefined behaviour when clicking buttons
            button.setInteractive(new Phaser.Geom.Circle(0, 0, 72), Phaser.Geom.Circle.Contains);
            this.fakeOS.addInputEvent(
                'pointerup',
                () => {
                    this.checkPIN(button);
                },
                button
            );
            this.numericPad.add(button);
        }

        this.addGrid(this.numericPad.getAll(), {
            columns: 3,
            rows: 7,
            offsetY: 192
        });
    }

    protected showDotsPIN(): void {
        let container = this.fakeOS.add.container();

        for (let i = 0; i < 4; i++) {
            let dot = this.fakeOS.add.circle(0, 0, 12, 0x0);
            dot.setStrokeStyle(6, 0xffffff);
            container.add(dot);
        }
        this.dots = container.getAll();
        this.addGrid(this.dots, {
            columns: 4,
            rows: 1,
            offsetY: 48
        });
    }

    protected showMessage(): void {
        this.message = this.fakeOS.add.text(
            0,0,
            this.fakeOS.getString('enter-passcode'),
            { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff', align: 'center' }
        );
        this.addRow(this.message);
    }

    // FIXME: notification.type is undefined
    protected checkPIN = (button: any) => {
        this.fakeOS.log("checkPIN");
        button.label.setColor('#000');
        if (button.sublabel)
            button.sublabel.setColor('#000');
        button.bg.setTint(0xffffff);
        let value: string = button.label.text;
        this.enterCode = this.enterCode + value;
        let lengthCode = this.enterCode.length;
        lengthCode--;

        if (lengthCode < 4) {
            this.dots[lengthCode].setFillStyle(0xffffff);
            if (lengthCode == 3) {
                if (this.enterCode === this.password) {
                    this.fakeOS.log("Password correct");
                    this.fakeOS.setDone('unlocked');
                    this.fakeOS.getUI().showHomeButton();
                    this.fakeOS.launchApp('HomescreenApp');
                } else {
                    // Reset everything
                    for (let dot of this.dots) dot.setFillStyle(0x000000);
                    this.enterCode = "";
                    // TODO: Find an alternative for shaking only the object nor the camera view
                    // TODO: https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
                    this.fakeOS.cameras.main.shake(250);
                    window.navigator.vibrate(500);
                    this.fakeOS.log("Password incorrect");
                    if (this.message !== undefined) {
                        this.message.text = this.fakeOS.getString('enter-passcode-failure');
                    }
                }
            }
        }
    }
}