import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';
import FeelsDankMan from '~/lib/ui/gameObjects/CustomObjTemplate';
import ButtonContainerUI from '~/lib/ui/gameObjects/ButtonContainerUI';
import { ButtonType } from '~/lib/ui/gameObjects/ButtonUI';
import PadUI from '~/lib/ui/gameObjects/PadUI';


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

        let samplePad = this.fakeOS.add.numpad(0, 0)
        this.fakeOS.tweens.add({
            targets: samplePad,
            x: 250,
            duration: 3000,
            ease: 'Power2',
            yoyo: true,
            repeat: 2
        });

        this.addGrid(samplePad, {x: 0, y: 0})
        this.elements.add(samplePad)

        /**
         * Add grid of number buttons
         */
        // let nums: number[] = [0, 1, 2, 3, 4, 5, 7, 8, 9]
        // let gridButtons:ButtonContainerUI[] = []
        // for (let num of nums) {
        //     let numberButton = this.fakeOS.add.buttonContainer(
        //         ButtonType.Number,
        //         num as unknown as string, // What the hell is that!?
        //         0,
        //         0,
        //         num === 0 ?
        //             this.newFeelsDankMan :
        //             () => { console.log(numberButton.value)}
        //     )
        //     gridButtons.push(numberButton)
        //     this.elements.add(numberButton)
        // }

        // let cellWidth: number = gridButtons[0]._width;
        // let cellHeight: number = gridButtons[0]._height;
        // let columns: number = 3
        // let rows: number = 3

        // this.addGrid(gridButtons, {
        //     x: (this.fakeOS.width / 2) - (cellWidth * columns / columns),
        //     offsetY: (this.fakeOS.height / 2) - (cellHeight * rows),
        //     columns: columns,
        //     rows: rows,
        //     cellWidth: cellWidth,
        //     cellHeight: cellHeight,
        //     position: Phaser.Display.Align.BOTTOM_CENTER
        // })

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
