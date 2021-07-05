import { ButtonType } from './ButtonUI'
import ButtonUI from './ButtonUI'
import ButtonContainerUI from './ButtonContainerUI'

declare global
{
    namespace Phaser.GameObjects
    {
        interface GameObjectFactory
        {
            numpad(x: number, y: number): PadUI
        }
    }
}

export default class PadUI extends Phaser.GameObjects.Container
{
    private button : ButtonContainerUI

    public constructor (scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y)
        // this.button = new ButtonUI(scene, ButtonType.Number, 0, 0, () => {})
        this.button = new ButtonContainerUI(scene, ButtonType.Number, 0, 0, 0, this.say_hello)
        this.add(this.button)
    }

    private say_hello = () => {
        console.log("Say your value:" +  this.button.value)
    }
}

Phaser.GameObjects.GameObjectFactory.register('numpad', function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number
){
    const scene = this.scene
    const numpad = new PadUI(scene, x, y)
    scene.sys.displayList.add(numpad)

    return numpad
})
