import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';

/**
 * Calculator app
 */
export default class CalculatorApp extends App {
    /**
     * Class constructor.
     *
     * @param fakeOS
     */    
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.x = 128;
        this.y = 320;
        this.button_size = 128;
        this.button_margin = 32;
    }

    /**
     * @inheritdoc
     */
    public render(): void {
        this.getActiveLayer().clear();
        this.setBackground();
        this.drawKeyboard();
        this.update();
    }

    protected drawKeyboard(): void {
        const buttons = "0123456789+-*/%=";
        let x_offset = this.button_size + this.button_margin;
        let y_offset = this.button_size + this.button_margin;
        let i = 0;
        let x = this.x
        let y = this.y
        for (const button of buttons) {
            let button_gui = new Phaser.GameObjects.Container(this.fakeOS, 0, 0);
            button_gui.add([
                new Phaser.GameObjects.Ellipse(this.fakeOS, x, y, this.button_size, this.button_size, 0xff00ff).
                    setStrokeStyle(3, 0x181818),
                new Phaser.GameObjects.Text(this.fakeOS, x, y , button, {
                    fontFamily: 'RobotoCondensed',
                    color: 0x181818,
                    fontSize: '64px',
                    fontStyle: '900',
                    baselineY: 1}).setOrigin(0.5)
            ]);
            button_gui.setInteractive(new Phaser.Geom.Circle(x,
                                                             y + (this.button_size / 2),
                                                             this.button_size / 2
                                                            ), Phaser.Geom.Circle.Contains);
            button_gui.on('pointerdown', () => {
                this.handleButtonClick(button);
            });

            this.getActiveLayer().add(button_gui.getAll());

            // Update position
            x = x + x_offset;
            i += 1;
            if (i % 4 == 0) {
                y = y + y_offset;
                x = this.x;
            }
            
        }
    }

    protected handleButtonClick(label) {
        // Handle the button click event
        console.info("Pressed: " + label);
    }
    
    /**
     * @inheritdoc
     */
    public update(delta: any, time: any): void {

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
