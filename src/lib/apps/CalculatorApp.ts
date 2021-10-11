import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';
import FeelsDankMan from '~/lib/ui/gameObjects/CustomObjTemplate';
import ButtonContainerUI from '~/lib/ui/gameObjects/ButtonContainerUI';
import ButtonCircleUI from '~/lib/ui/gameObjects/ButtonArcUI';


export default class CalculatorApp extends App {

    Display: Phaser.GameObjects.Text;

    // button: ButtonContainerUI;

    /**
     * Feels dank man custom object
     */
    dank!: FeelsDankMan

    /**
     * Array of danks
     */
    danks: FeelsDankMan[] = []

    /**
     * Scene
     */
    scene: FakeOS

    // Math operations
    const add : Function = (a: number, b: number): number => a + b;
    const subtract : Function = (a: number, b: number): number => a - b;
    const divide : Function = (a: number, b: number): number => a / b;
    const multiply : Function = (a: number, b: number): number => a * b;
    currentTotal: number; // What the current running total is
    currentOperator: string; // What the active operator is
    lastOperator: string; // The last operator that was pressed
    displayShouldClear: boolean;
    onDisplayUpdateHandlers: Array<Function>;
    onDisplay: string;
    /**
     * Class constructor.
     *
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.scene = fakeOS
        fakeOS.UI.render({ background: 'color', color: 0x000000});
    }

    /**
     * Render method.
     */
    public render(): void {
        this.showNumericPad();
        this.showDisplay();
    }

    /**
     * Update method.
     *
     * @param delta
     * @param time
     */
    public update(delta: any, time: any): void {
        for (var i in this.danks) {
            if (this.danks[i] !== undefined)
                this.danks[i].updateLocation()
        }
    }

    protected showDisplay(): void {
        // Display
        this.Display = this.fakeOS.add.text(0, 0, '', { fontFamily: 'Arial', fontSize: '140px', color: '#ffffff' });
        this.Display.x = this.fakeOS.width - 148;
        this.Display.y = 128;
        this.Display.text = '0';
        this.elements.add(this.Display)
    }

    protected showNumericPad(): void {
        var container = this.fakeOS.add.container(0, 0);
        var decimalAdded:boolean = false;
        var sizeButton:number = 64
        var colorNumberBackground:number = 0x313131;
        var colorOperatorBackground:number = 0xf69826;
        var colorTopOperatorBackground:number = 0xa0a0a0;

        // AC, +/-, %, /
        var buttonAC = this.fakeOS.add.buttonContainer('arc', 'AC', 0, 0, sizeButton, colorTopOperatorBackground);
        buttonAC.text.setColor("0x000000");
        buttonAC.text.setFontSize(54);
        buttonAC.button.onClick = this.buttonPressed.bind(this, buttonAC, 'operator');
        var buttonSign = this.fakeOS.add.buttonContainer('arc', '+/-', sizeButton * 2.5, 0, sizeButton, colorTopOperatorBackground);
        buttonSign.text.setColor("0x000000");
        buttonSign.text.setFontSize(54);
        buttonSign.button.onClick = this.buttonPressed.bind(this, buttonSign, 'operator');
        var buttonPercent = this.fakeOS.add.buttonContainer('arc', '%', sizeButton * 2.5 * 2, 0, sizeButton, colorTopOperatorBackground);
        buttonPercent.text.setColor("0x000000");
        buttonPercent.text.setFontSize(54);
        buttonPercent.button.onClick = this.buttonPressed.bind(this, buttonPercent, 'operator');
        var buttonDivide = this.fakeOS.add.buttonContainer('arc', '÷', sizeButton * 2.5 * 3, 0, sizeButton, colorOperatorBackground);
        buttonDivide.button.onClick = this.buttonPressed.bind(this, buttonDivide, 'operator');

        // 7, 8, 9, x
        var button7 = this.fakeOS.add.buttonContainer('arc', '7', 0, sizeButton * 2.5, sizeButton, colorNumberBackground);
        button7.button.onClick = this.buttonPressed.bind(this, button7, 'number');
        var button8 = this.fakeOS.add.buttonContainer('arc', '8', sizeButton * 2.5, sizeButton * 2.5, sizeButton, colorNumberBackground);
        button8.button.onClick = this.buttonPressed.bind(this, button8, 'number');
        var button9 = this.fakeOS.add.buttonContainer('arc', '9', sizeButton * 2.5 * 2, sizeButton * 2.5, sizeButton, colorNumberBackground);
        button9.button.onClick = this.buttonPressed.bind(this, button9, 'number');
        var buttonMultiply = this.fakeOS.add.buttonContainer('arc', 'x', sizeButton * 2.5 * 3, sizeButton * 2.5, sizeButton, colorOperatorBackground);
        buttonMultiply.button.onClick = this.buttonPressed.bind(this, buttonMultiply, 'operator');

        // 4, 5, 6, -
        var button4 = this.fakeOS.add.buttonContainer('arc', '4', 0, sizeButton * 2.5 * 2, sizeButton, colorNumberBackground);
        button4.button.onClick = this.buttonPressed.bind(this, button4, 'number');
        var button5 = this.fakeOS.add.buttonContainer('arc', '5', sizeButton * 2.5, sizeButton * 2.5 * 2, sizeButton, colorNumberBackground);
        button5.button.onClick = this.buttonPressed.bind(this, button5, 'number');
        var button6 = this.fakeOS.add.buttonContainer('arc', '6', sizeButton * 2.5 * 2, sizeButton * 2.5 * 2, sizeButton, colorNumberBackground);
        button6.button.onClick = this.buttonPressed.bind(this, button6, 'number');
        var buttonMinus = this.fakeOS.add.buttonContainer('arc', '-', sizeButton * 2.5 * 3, sizeButton * 2.5 * 2, sizeButton, colorOperatorBackground);
        buttonMinus.button.onClick = this.buttonPressed.bind(this, buttonMinus, 'operator');

        // 1, 2, 3, +
        var button1 = this.fakeOS.add.buttonContainer('arc', '1', 0, sizeButton * 2.5 * 3, sizeButton, colorNumberBackground);
        button1.button.onClick = this.buttonPressed.bind(this, button1, 'number');
        var button2 = this.fakeOS.add.buttonContainer('arc', '2', sizeButton * 2.5, sizeButton * 2.5 * 3, sizeButton, colorNumberBackground);
        button2.button.onClick = this.buttonPressed.bind(this, button2, 'number');
        var button3 = this.fakeOS.add.buttonContainer('arc', '3', sizeButton * 2.5 * 2, sizeButton * 2.5 * 3, sizeButton, colorNumberBackground);
        button3.button.onClick = this.buttonPressed.bind(this, button3, 'number');
        var buttonAdd = this.fakeOS.add.buttonContainer('arc', '+', sizeButton * 2.5 * 3, sizeButton * 2.5 * 3, sizeButton, colorOperatorBackground);
        buttonAdd.button.onClick = this.buttonPressed.bind(this, buttonAdd, 'operator');

        // 0, ., =
        // TODO: make button 0 as a horizontal capsule shape
        var button0 = this.fakeOS.add.buttonContainer('arc', '0', 0, sizeButton * 2.5 * 4, sizeButton, colorNumberBackground);
        button0.button.onClick = this.buttonPressed.bind(this, button0, 'number');
        var buttonDot = this.fakeOS.add.buttonContainer('arc', '.', sizeButton * 2.5 * 2, sizeButton * 2.5 * 4, sizeButton, colorNumberBackground);
        buttonDot.button.onClick = this.buttonPressed.bind(this, buttonDot, 'operator');
        var buttonEqual = this.fakeOS.add.buttonContainer('arc', '=', sizeButton * 2.5 * 3, sizeButton * 2.5 * 4, sizeButton, colorOperatorBackground);
        buttonEqual.button.onClick = this.buttonPressed.bind(this, buttonEqual, 'operator');

        // Set container position
        container.add([ buttonPercent, buttonSign, buttonAC, buttonDivide,
                        button7, button8, button9, buttonMultiply,
                        button4, button5, button6, buttonMinus,
                        button1, button2, button3, buttonAdd,
                        button0, buttonDot, buttonEqual
        ]);
        this.elements.add(container);
        container.x = sizeButton * 1.9;
        container.y = (this.fakeOS.height / 2) - (sizeButton * 4);
    }

    private numberPressed = (btn: buttonContainer) => {
        console.log(btn.value);
    }

    private actionPressed = (btn: buttonContainer) => {
        switch(btn.value) {
            case 'AC':
            case '%':
            case '+/-':
            case '+':
            case '-':
            case 'x':
            case '÷':
            case '.':
            case '=':
                this.currentOperator = btn.value;
                break;
        }
        console.log(this.currentOperator);
    }

    private buttonPressed = (btn: buttonContainer, kind) => {
        switch(kind) {
            case 'number':
                this.numberPressed(btn);
                break;
            case 'operator':
                this.actionPressed(btn);
                break;
            default:
                throw new Error('Button type not implemented!');
        }
    }
    /**
    /* Write something on the Display screen
     */
    private updateDisplay = (val: any) => {
        this.Display.text += val.text.text;
    }

    /**
     * Add a "Feels dank man" emote to scene
     */
    private newFeelsDankMan = () => {
        console.log("Surgar Dank Man");
        this.dank = this.fakeOS.add.dank(0, 0).setOrigin(0).setScale(1)
        this.dank.play('spinning')
        this.dank.x = Math.floor(Math.random() * this.fakeOS.width)
        this.dank.y = Math.floor(Math.random() * this.fakeOS.height)

        if (this.dank.x + this.dank.width >= this.fakeOS.width)
            this.dank.x -= this.dank.width

        this.danks.push(this.dank)
        this.elements.add(this.dank)
    }
}
