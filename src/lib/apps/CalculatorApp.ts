import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';

const WHITE  = '#ffffff';
const BLACK  = '#181818';
const PINK   = '#ff00ff';
const ORANGE = '#ffa500';
const GREY   = '#afafaf';
const MAX_FRACTION_DIGITS = 6;
const MAX_DISPLAY_DIGITS  = 11;
const DISPLAY_FONT_SIZE = 160;
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
    operator_button : any    = null;
    powerofTen      : number = 1;
    max_digits      : number = 9;
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
        this.buttons = "C±%÷789x456-123+ 0,=";
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
            fontSize: DISPLAY_FONT_SIZE + "px",
            fontStyle: '200',
            baselineY: 1,
            rtl: true,
            align: 'right'
        });
        this.getActiveLayer().add(this.display);
    }

    protected drawKeyboard(): void {
        const rows = 5;
        const cols = 4;
        let x = this.x
        let y = this.y
        let x_offset = this.buttonSize + this.buttonMargin;
        let y_offset = this.buttonSize + this.buttonMargin;
        let colorButton: any;
        let colorLabel: any;

        // Display calculator buttons in a grid of 4x4
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                let button = new Phaser.GameObjects.Container(this.fakeOS, 0, 0);
                let label = this.buttons.charAt(j * cols + i));

            if (label === ' ') continue;
            if (label === '+' || label === '-' || label === 'x' || label === '÷' || label === '=') {
                colorLabel = ORANGE;
            } else if (label === 'C' || label === '%' || label === '±') {
                colorLabel = GREY;
            } else {
                colorLabel = WHITE;
            }

            button.add([
                new Phaser.GameObjects.Ellipse(this.fakeOS,
                                               x + (i * x_offset),
                                               y + (j * y_offset),
                                               this.buttonSize,
                                               this.buttonSize,
                                               0x0).setStrokeStyle(3, 0x40E0D0),

                new Phaser.GameObjects.Text(this.fakeOS,
                                            x + (i * x_offset),
                                            y + (j * y_offset),
                                            label, {
                                                fontFamily: 'RobotoCondensed',
                                                color: colorLabel,
                                                fontSize: '64px',
                                                fontStyle: '900',
                                                baselineY: 1}).setOrigin(0.5)
            ]);

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
        this.operator = null;
    } else if (label === '±') {
        this.value *= -1;
    } else if (label === '+' || label === '-' || label === 'x' || label === '÷' || label === '%') {
        this.operator = label;
        this.operator_button = button;
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
                this.value.toFixed(4)
                break;
            case '%':
                this.value = this.buffer % this.value;
                break;

            default:
                console.info("!!Calculator App Error: Invalid operator!!!");
                break;
        }
        this.buffer = 0;
        this.operator = null;
        // Set poweroften related to number of decimals
        let precision = this.precision(this.value);
        if (precision > 0) {
            this.powerofTen += Math.min(precision, MAX_FRACTION_DIGITS);
            this.powerofTen *= -1;
        } else {
            this.powerofTen = 1;
        }
    } else if (label === ',') {
        this.powerofTen = -1;
    } else {
        if (this.powerofTen < 1) {
            if (this.value < 0) {
                this.value -= parseInt(label) * Math.pow(10, this.powerofTen);
            } else {
                this.value += parseInt(label) * Math.pow(10, this.powerofTen);
            }
            this.powerofTen--;
        } else {
            if (this.value < 0) {
                this.value = Math.pow(10, this.powerofTen) * this.value - parseInt(label);
            } else {
                this.value = Math.pow(10, this.powerofTen) * this.value + parseInt(label);
            }
        }
        if (this.operator !== null) {
            this.operator_button.getAt(0).setFillStyle(0x0);
        }
    }

    // Display value or buffer
    let nf = new Intl.NumberFormat('es-ES', {
        notation: "scientific",
        signDisplay : 'negative',
        notation : 'standard',
        maximumFractionDigits: MAX_FRACTION_DIGITS,
    })


    let display : String = nf.format(this.value);
    if (this.operator !== null && this.value === 0) {
        display = nf.format(this.buffer);
    }

    // Log value
    console.info("Current Value (number): " + this.value);
    console.info("Current Buffer (number): " + this.buffer);
    // console.info("Current operator: " + this.operator);
    // console.info("Power of ten: " + this.powerofTen);

    ////////////////////////////////////////////////////
    // @PHASER3-FEATURE-REQUEST:
    // Add CSS property 'unicode-bidi' to text style #6581
    // https://stackoverflow.com/questions/29074287/how-to-change-negative-sign-position-css
    // https://github.com/photonstorm/phaser/issues/6581
    // Closed because Canvas API (Not implemented)
    //
    let len : number = display.length;
    if ((this.value || this.buffer) < 0 && display.charAt(len-1) != '-') {
        console.info("Match");
        display = display.slice(1);
        display += '-';
    }
    ////////////////////////////////////////////////////
    // Display area
    if (display.length <= MAX_DISPLAY_DIGITS) {
        if (display.length > 7) {
            let oldfontSize = parseInt(this.display.style.fontSize);
            // @TODO: Need to improve this and fix display text position after its size has changed
            let newfontSize = oldfontSize - ((display.length - 7) * (10 - (display.length - 6)));
            this.display.setFontSize(newfontSize);
        } else {
            this.display.setFontSize(DISPLAY_FONT_SIZE);
        }
    } else {
        // Sure there's a better way to improve this
        if (this.operator !== null) {
            display = this.buffer.toExponential(0).toString().replace('+','');
        } else {
            display = this.value.toExponential(0).toString().replace('+','');
        }
    }

    this.display.setText(display)
    // Add color effect showing button has been clicked
    shapeObject.setFillStyle(0xffff00);
}

protected releaseButtonClick(button) {
    // When release click button
    let shapeObject = button.getAt(0);
    let textObject = button.getAt(1);
    let label = textObject.text;
    shapeObject.setFillStyle(0x0);
    if ("±C".includes(label)) shapeObject.setFillStyle(GREY);
    if (this.operator !== null && "+-x÷%".includes(label)) {
        shapeObject.setFillStyle(0xffffff);
    }
}

// Stolen from https://stackoverflow.com/questions/9553354/how-do-i-get-the-decimal-places-of-a-floating-point-number-in-javascript
protected precision(num) {
    if (isNaN(+num)) return 0;
    const decimals = (num + '').split('.')[1];
    if (decimals) return decimals.length;
    return 0;
}

/**
 * Set app background
 */
protected setBackground(image?: string): void {
    if (image !== undefined) {
        this.fakeOS.UI.setBackground(image);
    } else {
        let background = this.fakeOS.cache.json.get('apps').find((app: any) => app.key == 'CalculatorApp').background;
        this.fakeOS.UI.setBackground(background);
    }
}
}
