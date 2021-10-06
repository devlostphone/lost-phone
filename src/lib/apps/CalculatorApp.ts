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
    protected showNumericPad(): void {

        //  Our container
        var keys:string[] = ['0', '1', '2', '4', '5', '6', '7', '8', '9'];
        var operators1:string[] = ['÷', 'x', '-', '+'];
        var operators2:string[] = ['AC', '=', '.', '%', '+/-'];
        var decimalAdded:boolean = false;
        var sizeButton:number = 64
        var container = this.fakeOS.add.container(0, 0);
        var colorNumberBackground:number = 0x313131;
        var colorOperatorBackground:number = 0xf69826;

        // 7, 8, 9, x
        var button7 = this.fakeOS.add.buttonContainer('arc', '7', 0, 0, sizeButton, colorNumberBackground);
        button7.button.onClick = this.buttonPressed.bind(this, button7, 'number');
        var button8 = this.fakeOS.add.buttonContainer('arc', '8', sizeButton * 2.5, 0, sizeButton, colorNumberBackground);
        button8.button.onClick = this.buttonPressed.bind(this, button8, 'number');
        var button9 = this.fakeOS.add.buttonContainer('arc', '9', sizeButton * 2.5 * 2, 0, sizeButton, colorNumberBackground);
        button9.button.onClick = this.buttonPressed.bind(this, button9, 'number');
        var buttonMultiply = this.fakeOS.add.buttonContainer('arc', 'x', sizeButton * 2.5 * 3, 0 sizeButton, colorOperatorBackground);
        buttonMultiply.button.onClick = this.buttonPressed.bind(this, buttonMultiply, 'operator');

        // 4, 5, 6, -
        var button4 = this.fakeOS.add.buttonContainer('arc', '4', 0, sizeButton * 2.5, sizeButton, colorNumberBackground);
        button4.button.onClick = this.buttonPressed.bind(this, button4, 'number');
        var button5 = this.fakeOS.add.buttonContainer('arc', '5', sizeButton * 2.5, sizeButton * 2.5, sizeButton, colorNumberBackground);
        button5.button.onClick = this.buttonPressed.bind(this, button5, 'number');
        var button6 = this.fakeOS.add.buttonContainer('arc', '6', sizeButton * 2.5 * 2, sizeButton * 2.5, sizeButton, colorNumberBackground);
        button6.button.onClick = this.buttonPressed.bind(this, button6, 'number');
        var buttonMinus = this.fakeOS.add.buttonContainer('arc', '-', sizeButton * 2.5 * 3, sizeButton * 2.5, sizeButton, colorOperatorBackground);
        buttonMinus.button.onClick = this.buttonPressed.bind(this, buttonMinus, 'operator');

        // 1, 2, 3, +
        var button3 = this.fakeOS.add.buttonContainer('arc', '3', 0, sizeButton * 2.5 * 2, sizeButton, colorNumberBackground);
        button3.button.onClick = this.buttonPressed.bind(this, button3, 'number');
        var button2 = this.fakeOS.add.buttonContainer('arc', '2', sizeButton * 2.5, sizeButton * 2.5 * 2, sizeButton, colorNumberBackground);
        button2.button.onClick = this.buttonPressed.bind(this, button2, 'number');
        var button1 = this.fakeOS.add.buttonContainer('arc', '1', sizeButton * 2.5 * 2, sizeButton * 2.5 * 2, sizeButton, colorNumberBackground);
        button1.button.onClick = this.buttonPressed.bind(this, button1, 'number');
        var buttonAdd = this.fakeOS.add.buttonContainer('arc', '+', sizeButton * 2.5 * 3, sizeButton * 2.5 * 2, sizeButton, colorOperatorBackground);
        buttonAdd.button.onClick = this.buttonPressed.bind(this, buttonAdd, 'operator');

        // Set container position
        container.add([ button9, button8, button7, button6, button5, button4, button3, button2, button1, buttonMultiply, buttonMinus, buttonAdd]);
        this.elements.add(container);
        container.x = sizeButton * 1.75;
        container.y = (this.fakeOS.height / 2) - (sizeButton * 2.5);

        // Display
        this.Display = this.fakeOS.add.text(0, 0, '', { fontFamily: 'Arial', fontSize: '92px', color: '#ffffff' });
        this.Display.x = 32;
        this.Display.y = 128;
        this.elements.add(this.Display)
    }

    private numberPressed = (btn: buttonContainer) => {
        console.log(btn.value);
    }

    private actionPressed = (btn: buttonContainer) => {
        switch(btn.value) {
            case '+':
            case '-':
            case 'x':
            case '÷':
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
