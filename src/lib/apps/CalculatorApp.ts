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
        // TODO: Rewrite this using grid instead of hardcoding buttons and display positions
        var row: number = 0;
        ['0', '1', '2', '4', '5', '6', '7', '8', '9'].forEach( (value, index) => {
            if ((index % 4) === 0) row +=1;
            let button = this.fakeOS.add.buttonContainer('arc', value, 72 + ((index % 4) * 150), 280  + (row * 150), 64, 0x3c3c3c);
            button.button.onClick = this.updateDisplay.bind(this, button);
            this.elements.add(button);
        });
        // this.addGrid(this.buttons, {x: 64, y: 4});

        // Display
        this.Display = this.fakeOS.add.text(0, 0, '', { fontFamily: 'Arial', fontSize: '92px', color: '#ffffff' });
        this.Display.x = 32;
        this.Display.y = 128;
        this.elements.add(this.Display)
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
