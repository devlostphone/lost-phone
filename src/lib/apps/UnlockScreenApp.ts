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
    protected enterCode: string;

    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.password = this.fakeOS.cache.json.get('unlock-screen').password;
        // TODO: Localize this message
        this.message = "Introdueix el PIN per desbloquejar";
        this.enterCode = "";
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
                button = this.fakeOS.add.button('arc', label, 0, 0, { });
            } else {
                button = this.fakeOS.add.button('arc', label, 0, 0, { 'sublabel': numericSubLabels[Number(label) - 2]});
            }

            // INFO: 72 is the half value of rect/arc/capsule dimension (144)
            button.setInteractive(new Phaser.Geom.Circle(0, 0, 72), Phaser.Geom.Circle.Contains);
            button.on('pointerdown', function() {
                button.label.setColor('#ffffff');
                if (button.sublabel)
                    button.sublabel.setColor('#ffffff');
                button.bg.setTint(0x000000);
            });

            button.on('pointerup', this.checkPIN.bind(this, button));
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
        this.addRow(this.fakeOS.add.text(0,0, this.message, { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff', align: 'center' }));
    }

    // FIXME: notification.type is undefined
    protected checkPIN = (button: any) => {
        button.label.setColor('#000');
        if (button.sublabel)
            button.sublabel.setColor('#000');
        button.bg.setTint(0xffffff);
        let value: string = button.label.text;
        this.enterCode = this.enterCode + value;
        let lengthCode = parseInt(this.enterCode.length);
        lengthCode--;

        if (lengthCode < 4) {
            this.dots[lengthCode].setFillStyle(0xffffff);
            if (lengthCode == 3) {
                if (this.enterCode === this.password) {
                    console.log("Password correct");
                    // TODO: Switch to homescreen at this point
                } else {
                    // Reset everything
                    for (let dot of this.dots) dot.setFillStyle(0x000000);
                    this.enterCode = "";
                    // TODO: Find an alternative for shaking only the object nor the camera view
                    this.fakeOS.cameras.main.shake(250);
                    console.log("Password incorrect");
                }
            }
        }
    }
}