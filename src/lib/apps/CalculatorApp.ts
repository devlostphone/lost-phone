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
        let container = this.fakeOS.add.container();
        let decimalAdded:boolean = false;
        let sizeButton:number = 64
        let colorNumberBackground:number = 0x313131;
        let colorOperatorBackground:number = 0xf69826;
        let colorTopOperatorBackground:number = 0xa0a0a0;
        let keys = [
            { "label" : "AC", "type" : "operator", "shape" : "arc", "background": 0xa0a0a0 },
            { "label" : "+/-", "type" : "operator", "shape" : "arc", "background": 0xa0a0a0 },
            { "label" : "%", "type" : "operator", "shape" : "arc", "background": 0xa0a0a0  },
            { "label" : "÷", "type" : "operator", "shape" : "arc", "background": 0xf69826 }
            { "label" : "7", "type" : "number", "shape" : "arc", "background": 0x313131 },
            { "label" : "8", "type" : "number", "shape" : "arc", "background": 0x313131 },
            { "label" : "9", "type" : "number", "shape" : "arc", "background": 0x313131 },
            { "label" : "x", "type" : "operator", "shape" : "arc", "background": 0xf69826 },
            { "label" : "4", "type" : "number", "shape" : "arc", "background": 0x313131 },
            { "label" : "5", "type" : "number", "shape" : "arc", "background": 0x313131 },
            { "label" : "6", "type" : "number", "shape" : "arc", "background": 0x313131 },
            { "label" : "-", "type" : "operator", "shape" : "arc", "background": 0xf69826 },
            { "label" : "1", "type" : "number", "shape" : "arc", "background": 0x313131 },
            { "label" : "2", "type" : "number", "shape" : "arc", "background": 0x313131 },
            { "label" : "3", "type" : "number", "shape" : "arc", "background": 0x313131 },
            { "label" : "+", "type" : "operator", "shape" : "arc", "background": 0xf69826 },
            { "label" : "0", "type" : "number", "shape" : "arc", "background": 0x313131 },
            { "label" : ",", "type" : "operator", "shape" : "arc", "background": 0x313131 },
            { "label" : "=", "type" : "operator", "shape" : "arc", "background": 0xf69826 }
        ];

        for (let key of keys) {
            let button = this.fakeOS.add.buttonContainer(
                key.shape,
                key.label,
                0, 0,
                sizeButton,
                key.background
            );

            ['%', 'AC', '+/-'].includes(key.label) ? button.text.setFontSize(54) : null;

            button.button.onClick = this.buttonPressed.bind(this, button, key.type);

            container.add(button);
        }

        let buttons = container.getAll();

        this.addGrid(
            buttons,
            {
                columns: 4,
                rows: 8
            });

        container.x = 24;
        container.y = (this.fakeOS.height / 5);
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
