/**
 * Calculator App
 * @todo:
 */

import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';
import '~/lib/ui/gameObjects/CustomObjTemplate';
import '~/lib/ui/gameObjects/ButtonUI';

export default class CalculatorApp extends App {

    /**
     * Feels dank man custom object
     */
    dank: any

    /**
     * Array of danks
     */
    danks: any[] = []

    /**
     * A simple button
     */
    button: any
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
         * Add a simple purple square button
         */
        this.button = this.fakeOS.add.button(
            this.fakeOS.width / 2,
            this.fakeOS.height / 2
        )

        /**
         * Assign function to button callback
         */
        this.button.doSomething = this.newFeelsDankMan
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
                this.danks[i].updateLocation(this.fakeOS)
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
    }
}
