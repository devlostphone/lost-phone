import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';
import FeelsDankMan from '~/lib/ui/gameObjects/CustomObjTemplate';
import ButtonContainerUI from '~/lib/ui/gameObjects/ButtonContainerUI';
import { ButtonType } from '~/lib/ui/gameObjects/ButtonRectUI';
import ButtonCircleUI from '~/lib/ui/gameObjects/ButtonArcUI';
import CalculatorPadUI from '~/lib/ui/gameObjects/CalculatorPadUI';

export default class CalculatorApp extends App {

    sampleText!: Phaser.GameObjects.Text

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
        // TODO: Set a specific background depending of active app
        this.fakeOS.setBackground('flatcolor', 0xff0000);
    }

    /**
     * Render method.
     */
    public render(): void {
        // TODO: Remove backbutton from phoneUI.ts
        console.log(this.fakeOS.getBackFunction());


        let buttonArc = this.fakeOS.add.buttonArc(128, 192, 64, this.newFeelsDankMan)
        this.elements.add(buttonArc)

        this.sampleText = this.fakeOS.add.text(0, 0, '', { fontFamily: 'Arial', fontSize: '64px', color: '#00ff00' })
        this.addGrid(this.sampleText, {x: 64, y: 0})
        this.elements.add(this.sampleText)

        let CalculatorPad = this.fakeOS.add.calcpad(0, 0, this.sampleText)
        this.addGrid(CalculatorPad, {x: 64, y: 4})
        this.elements.add(CalculatorPad)

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
