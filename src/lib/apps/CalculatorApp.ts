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
    result          : any    = null;
    value           : number = 0;
    buffer          : number = 0;
    operator        : any    = null;
    powerofTen      : number = 1;
    max_digits      : number = 9;
    operator_button : any    = null;
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

    // Grab some internal values from button Object
    let shapeObject = button.getAt(0);
    let textObject = button.getAt(1);
    let label = textObject.text;

    // Parse input from keyboard
    if (label === 'C') {
        this.value = 0;
        this.buffer = 0;
        this.powerofTen = 1;
    } else if (label === '±') {
        this.value *= -1;
    } else if (label === '+' || label === '-' || label === 'x' || label === '÷' || label === '%') {
        this.operator = label;
        this.buffer = this.value;
        this.value = 0;
        this.powerofTen = 1;
    } else if (label === '=') {
        switch(this.operator) {
            case '+':
                this.value += this.buffer;
                break;
            case '-':
                this.value = this.buffer - this.value;
                break;
            case 'x':
                this.value *= this.buffer;
                break;
            case '÷':
                this.value = this.buffer / this.value;
                break;
            case '%':
                this.value = this.buffer % this.value;
                break;

            default:
                console.info("!!Calculator App Error: Invalid operator!!!");
                break;
        }
        this.buffer = 0;
        this.powerofTen = 1;
    } else if (label === ',') {
        this.powerofTen = -1;
    } else {
        if (this.powerofTen < 1) {
            this.value += parseInt(label) * Math.pow(10, this.powerofTen);
            this.powerofTen--;
        } else {
            this.value = Math.pow(10, this.powerofTen) * this.value + parseInt(label);
        }
    }

    // Log value
    console.info("Current Value (number): " + this.value);
    console.info("Current Buffer (number): " + this.buffer);
    console.info("Power of ten: " + this.powerofTen);

    this.display.text = this.value.toString();
    // Add color effect showing button has been clicked
    shapeObject.setFillStyle(0xffff00);
}

// protected handleButtonClick(button) {
//     let buffer : number;
//     // Stop clicking more number than max_digits
//     if (this.display.text.length > this.max_digits) return;

//     // Handle the button click event
//     let shapeObject = button.getAt(0);
//     let textObject = button.getAt(1);
//     let label = textObject.text;

//     // Add visual color effect to inform button has been clicked
//     shapeObject.setFillStyle(0xffff00);

//     // Parse input
//     if (label === 'C') {
//         // Reset values
//         this.value = 0;
//         this.currentInput = '0';
//         this.currentOperator = null;
//         // Reset operator button from memory
//         if (this.operator_button !== null) {
//             if ("+-x÷".includes(this.operator_button.getAt(1).text)) {
//                 this.operator_button.getAt(0).setFillStyle(0xffa500);
//             } else if ("±%".includes(this.operator_button.getAt(1).text)) {
//                 this.operator_button.getAt(0).setFillStyle(0xafafaf);
//             }
//             this.operator_button = null;
//         }
//     } else if (label === '±') {
//         this.value *= -1;
//     } else if (label === '+' || label === '-' || label === 'x' || label === '÷' || label === '%') {
//         this.currentOperator = label;
//         if (this.operator_button !== null) {
//             // Reset operator button from memory
//             if ("+-x÷".includes(this.operator_button.getAt(1).text)) {
//                 this.operator_button.getAt(0).setFillStyle(0xffa500);
//             } else if ("±%".includes(this.operator_button.getAt(1).text)) {
//                 this.operator_button.getAt(0).setFillStyle(0xafafaf);
//             }
//             this.operator_button = null;
//         }
//         this.operator_button = button;
//         buffer = this.value;
//     } else if (label === '=') {
//         switch (this.currentOperator) {
//             case '+':
//                 this.value += buffer;
//                 break;
//             case '-':
//                 this.value -= buffer;
//                 break;
//             case 'x':
//                 this.value *= buffer;
//                 break;
//             case '÷':
//                 this.value /= buffer;
//                 break;
//             case '%':
//                 this.value %= buffer;
//                 break;
//         }
//         this.currentOperator = null;
//         // Reset operator button from memory
//         if ("+-x÷".includes(this.operator_button.getAt(1).text)) {
//             this.operator_button.getAt(0).setFillStyle(0xffa500);
//         } else if ("±%".includes(this.operator_button.getAt(1).text)) {
//             this.operator_button.getAt(0).setFillStyle(0xafafaf);
//         }
//         this.operator_button = null;
//         // this.currentInput = Intl.NumberFormat().format(this.result);
//     } else if (label === ',') {
//         // You can't have more of one comma
//         if ((this.currentInput.match(/,/g) || []).length > 0) return;
//         this.currentInput += ',';
//     } else {
//         // if (this.currentInput.length == this.max - 3) {
//         //     this.display.setFontSize(145)
//         // } else if (this.currentInput.length == this.max - 2) {
//         //     this.display.setFontSize(135)
//         // } else if (this.currentInput.length == this.max - 1) {
//         //     this.display.setFontSize(125)
//         // } else if (this.currentInput.length == this.max) {
//         //     this.display.setFontSize(115)
//         // }

//         if (this.currentInput === '0') {
//             this.currentInput = label;
//         } else {
//             this.currentInput += label;
//         }
//     }

//     // if (this.currentInput.length <= max) {
//     //     this.display.text = this.currentInput.substring(0,max)
//     // }

//     console.info("Current operator: " + this.currentOperator);
//     console.info("Current Value (number): " + this.value);
//     console.info("Current Input (string): " + this.currentInput);

//     // if (this.currentInput.includes('-')) {
//     //     let index:number = this.currentInput.indexOf('-');
//     //     this.display.text += '-';
//     // }
//     if (this.value < 0) {
//         this.currentInput = '-' + this.currentInput;
//     } else if (this.value >= 0 &&  this.currentInput.indexOf('-') == 0) {
//         this.currentInput.replace("-", '');
//     }

//     this.value = parseFloat(this.currentInput.replace(",", "."));
//     let foo = this.value.toString().
//         replace(".", ",").
//         replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

//     this.display.text = foo;



// }

protected releaseButtonClick(button) {
    // When release click button
    let shapeObject = button.getAt(0);
    let textObject = button.getAt(1);
    let label = textObject.text;
    shapeObject.setFillStyle(0xff00ff);
    if ("±C".includes(label)) shapeObject.setFillStyle(0xafafaf);
    if (this.currentOperator !== null && "+-x÷%".includes(label)) {
        shapeObject.setFillStyle(0xffffff);
    }
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
