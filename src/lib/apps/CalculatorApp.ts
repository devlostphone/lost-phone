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
         * Add a "Feels dank man" emote to scene
         */
        let newFeelsDankMan = () => {
            this.dank = this.fakeOS.add.dank(0, 0).setOrigin(0).setScale(1)
            this.dank.play('spinning')
            this.dank.x = Math.floor(Math.random() * this.fakeOS.width)
            this.dank.y = Math.floor(Math.random() * this.fakeOS.height)

            if (this.dank.x + this.dank.width >= this.fakeOS.width)
                this.dank.x -= this.dank.width
        }

        /**
         * Add a simple purple square button
         */
        this.button = this.fakeOS.add.button(
            this.fakeOS.width / 2,
            this.fakeOS.height / 2,
            newFeelsDankMan
        )
    }

    /**
     * Update method.
     *
     * @param delta
     * @param time
     */
    public update(delta: any, time: any): void {
        // this.updateDank()
    }

    /**
     * Update dank location and direction
     *
     */
    private updateDank() {
        this.dank.x += this.dank.vx
        this.dank.y += this.dank.vy

        if (this.dank.y < 0) {
            this.dank.y = 0
            this.dank.vy *= -1
        }

        if (this.dank.y + 112 >= this.fakeOS.height) {
            this.dank.y = this.fakeOS.height - 112 - 1
            this.dank.vy *= -1
        }

        if (this.dank.x < 0) {
            this.dank.x = 0
            this.dank.vx *= -1
        }
        if (this.dank.x + 112 >= this.fakeOS.width) {
            this.dank.x = this.fakeOS.width - 112 - 1
            this.dank.vx *= -1
        }

    }

}
