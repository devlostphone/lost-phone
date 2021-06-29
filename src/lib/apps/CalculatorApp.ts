import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';
import FeelsDankMan from '~/lib/ui/gameObjects/CustomObjTemplate';
import ButtonContainerUI from '~/lib/ui/gameObjects/ButtonContainerUI';
import { ButtonType } from '~/lib/ui/gameObjects/ButtonUI';

export default class CalculatorApp extends App {

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
    }

    /**
     * Render method.
     */
    public render(): void {
        /**
         * Add a simple emoji buttonContainer
         */
        let emojiButton = this.fakeOS.add.buttonContainer(
            ButtonType.Emoji,
            '\ud83d\ude03',
            this.fakeOS.width / 4,
            this.fakeOS.height / 4,
            this.newFeelsDankMan
        )
        /**
         * Add a simple number buttonContainer
         */
        let numberButton = this.fakeOS.add.buttonContainer(
            ButtonType.Number,
            '0',
            this.fakeOS.width / 6,
            this.fakeOS.height / 6,
            () => { console.log(numberButton.value)}
        )

        this.elements.add(emojiButton)
        this.elements.add(numberButton)
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
