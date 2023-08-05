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
    margin          : number;
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
        this.margin = (this.area.width - buttons_row_size) / 2  + (this.buttonSize / 2);
        this.x = this.margin;
        this.y = 360;

        // Declare which label buttons will define Calculator App
        this.buttons = "C±%÷789x456-123+0,=";
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
        this.display = new Phaser.GameObjects.Text(this.fakeOS, this.area.width - this.margin + 40, 92, '0', {
            fontFamily: 'Roboto',
            color: "#fff",
            fontSize: '160px',
            fontStyle: '200',
            baselineY: 1,
            rtl: true,
            align: 'right',
        });
        this.getActiveLayer().add(this.display);
    }

    protected drawKeyboard(): void {
        let x = this.x
        let y = this.y
        let x_offset = this.buttonSize + this.buttonMargin;
        let y_offset = this.buttonSize + this.buttonMargin;
        const rows = 5;
        const cols = 4;

        // Display calculator buttons in a grid of 4x4
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                let button = new Phaser.GameObjects.Container(this.fakeOS, 0, 0);
                let label = this.buttons.charAt(j * cols + i));
            let colorButton = 0xff00ff;
            if (label === '+' || label === '-' || label === 'x' || label === '÷') {
                colorButton = 0xffa500;
            } else if (label === 'C' || label === '%' || label === '±') {
                colorButton = 0xafafaf;
            }
            
            button.add([
                new Phaser.GameObjects.Ellipse(this.fakeOS,
                                               x + (i * x_offset),
                                               y + (j * y_offset),
                                               this.buttonSize,
                                               this.buttonSize,
                                               colorButton).setStrokeStyle(3, 0x40E0D0),
                new Phaser.GameObjects.Text(this.fakeOS,
                                            x + (i * x_offset),
                                            y + (j * y_offset),
                                            label, {
                                                fontFamily: 'RobotoCondensed',
                                                color: 0x181818,
                                                fontSize: '64px',
                                                fontStyle: '900',
                                                baselineY: 1}).setOrigin(0.5)]
                      );

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
    let max :number = 9;
    console.info(this.display.text.length);
    if (this.display.text.length > max) return;
    
    // Handle the button click event
    let shapeObject = button.getAt(0);
    let textObject = button.getAt(1);
    let label = textObject.text;
    shapeObject.setFillStyle(0xffff00);

    // Parse input
    if (label === 'C') {
        this.currentInput = '0';        
    } else if (label === '±') {
        let inputNum = parseFloat(this.currentInput);
        inputNum *= -1;
        this.currentInput = inputNum.toString();
    } else if (label === '+' || label === '-' || label === 'x' || label === '÷') {
        this.currentOperator = label;
        this.result = parseFloat(this.currentInput);
        this.currentInput = '0';
    } else if (label === '=') {
        let inputNum = parseFloat(this.currentInput);
        switch (this.currentOperator) {
            case '+':
                this.result += inputNum;
                break;
            case '-':
                this.result -= inputNum;
                break;
            case 'x':
                this.result *= inputNum;
                break;
            case '÷':
                this.result /= inputNum;
                break;
        }
        this.currentInput = this.result.toString();
    } else {
        if (this.currentInput.length == max - 3) {
            this.display.setFontSize(145)
        } else if (this.currentInput.length == max - 2) {
            this.display.setFontSize(135)
        } else if (this.currentInput.length == max - 1) {
            this.display.setFontSize(125)
        } else if (this.currentInput.length == max) {
            this.display.setFontSize(115)
        }
        
        if (this.currentInput === '0') {
            this.currentInput = label;
        } else {
            this.currentInput += label;
        }
    }

    if (this.currentInput.includes('-')) {
        let index:number = this.currentInput.indexOf('-');
        this.display.text += '-';
    } else {
        if (this.currentInput.length <= max) {
            this.display.text = this.currentInput.substring(0,max);
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
