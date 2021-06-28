/**
 * Calculator App
 * @todo: create file of imports of classes
 * @todo: add object files to elements from App.ts
 */

import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';
import FeelsDankMan from '~/lib/ui/gameObjects/CustomObjTemplate';
import ButtonUI from '~/lib/ui/gameObjects/ButtonUI';
import { ButtonType } from '~/lib/ui/gameObjects/ButtonUI';
import ButtonContainerUI from '~/lib/ui/gameObjects/ButtonContainerUI';

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
     * A simple button
     */
    button!: ButtonUI
    /**
     * A simple button
     */
    buttonContainer!: ButtonContainerUI
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
            ButtonType.Emoji,
            this.fakeOS.width / 2,
            this.fakeOS.height / 2,
        )
        this.button.doSomething = this.newFeelsDankMan
        /**
         * Add a simple emoji buttonContainer
         */
        this.buttonContainer = this.fakeOS.add.buttonContainer(
            ButtonType.Emoji,
            this.fakeOS.width / 4,
            this.fakeOS.height / 4,
        )
        this.buttonContainer.button.doSomething = this.newFeelsDankMan

        this.elements.add(this.button)
        this.elements.add(this.buttonContainer)
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
