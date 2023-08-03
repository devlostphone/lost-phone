import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';

/**
 * Calculator app
 */
export default class CalculatorApp extends App {

    x : number;
    y : number;

    /**
     * Some variables related to calculator's keyboard
     */
    buttonSize      : number = 128;
    buttonMargin    : number = 32;
    buttonsRow      : number = 4;
    buttons         : string;
    currentInput    : string = '0';
    currentOperator : any    = null;
    result          : any    = null;
    display         : Phaser.GameObjects.Text;

    /**
     * Class constructor.
     *
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        // Set X and Y keyboard position
        // @INFO: You must add the half of button size because its Origin is set to 0.5
        let buttons_row_size = (this.buttonSize * this.buttonsRow) + (this.buttonMargin * (this.buttonsRow - 1));
        this.x = (this.area.width - buttons_row_size) / 2  + (this.buttonSize / 2) ;
        this.y = 360;

        // Declare which label buttons will define Calculator App
        this.buttons = "0123456789+-*/%=";
    }

    /**
     * @inheritdoc
     */
    public render(): void {
        this.getActiveLayer().clear();
        this.drawDisplay();
        this.drawKeyboard();
        this.setBackground();
        this.update();
    }

    protected drawDisplay(): void {
        this.display = new Phaser.GameObjects.Text(this.fakeOS, this.x + 256, 128, '0', {
            fontFamily: 'RobotoCondensed',
            color: "#ffff00",
            fontSize: '92px',
            fontStyle: '900',
            baselineY: 1,
            rtl: false}).setOrigin(0.5);
        this.getActiveLayer().add(this.display);
    }

    protected drawKeyboard(): void {
        let x = this.x
        let y = this.y
        let x_offset = this.buttonSize + this.buttonMargin;
        let y_offset = this.buttonSize + this.buttonMargin;
        const rows = 4;
        const cols = 4;

        // Display calculator buttons in a grid of 4x4
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                let button = new Phaser.GameObjects.Container(this.fakeOS, 0, 0);
                let label = this.buttons.charAt(j * cols + i));
            button.add([
                new Phaser.GameObjects.Ellipse(this.fakeOS,
                                               x + (i * x_offset),
                                               y + (j * y_offset),
                                               this.buttonSize,
                                               this.buttonSize,
                                               0xff00ff).setStrokeStyle(3, 0x40E0D0),
                new Phaser.GameObjects.Text(this.fakeOS,
                                            x + (i * x_offset),
                                            y + (j * y_offset),
                                            label, {
                                                fontFamily: 'RobotoCondensed',
                                                color: 0x181818,
                                                fontSize: '64px',
                                                fontStyle: '900',
                                                baselineY: 1}).setOrigin(0.5)]);

            // Implement button's interaction
            button.setInteractive(
                new Phaser.Geom.Circle(x + (i * x_offset),
                                       y + (j * y_offset),
                                       this.buttonSize / 2),
                Phaser.Geom.Circle.Contains);
            button.on('pointerdown', () => {
                this.handleButtonClick(button);
            });
            button.on('pointerup', () => {
                this.releaseButtonClick(button);
            });

            this.getActiveLayer().add(button);
        }
    }
}

protected handleButtonClick(button) {
    // Handle the button click event
    let shapeObject = button.getAt(0);
    let textObject = button.getAt(1);
    let label = textObject.text;
    shapeObject.setFillStyle(0xffff00);

    // Parse input
    if (label === '+' || label === '-' || label === '*' || label === '/') {
        this.currentOperator = label;
        this.result = parseFloat(this.currentInput);
        this.currentInput = '0';
        this.display.text = label;
    } else if (label === '=') {
        const inputNum = parseFloat(this.currentInput);
        switch (this.currentOperator) {
            case '+':
                this.result += inputNum;
                break;
            case '-':
                this.result -= inputNum;
                break;
            case '*':
                this.result *= inputNum;
                break;
            case '/':
                this.result /= inputNum;
                break;
        }
        this.currentInput = this.result.toString();
        this.display.text = this.currentInput;
    } else {
        if (this.currentInput === '0') {
            this.currentInput = label;
            this.display.text = label;
        } else {
            this.currentInput += label;
            this.display.text += label;
        }
    }
}

protected releaseButtonClick(button) {
    // When release click button
    let shapeObject = button.getAt(0);
    shapeObject.setFillStyle(0xff00ff);
}

/**
 * @inheritdoc
 */
public update(delta: any, time: any): void {
    // pass
}

/**
 * Set app background
 */
protected setBackground(image?: string): void {
    if (image !== undefined) {
        this.fakeOS.UI.setBackground(image);
    } else {
        let background = this.fakeOS.cache.json.get('apps').find((app: any) => app.key == 'CalculatorApp').wallpaper;
        this.fakeOS.UI.setBackground(background);
    }
}
}
