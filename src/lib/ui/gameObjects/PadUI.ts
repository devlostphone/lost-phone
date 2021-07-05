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
    private buttons: ButtonContainerUI[] = []
    private rows: number = 3
    private columns: number = 5

    public constructor (scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y)
        let val: any[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd']
        for (let some of val) {
            let button: ButtonContainerUI = new ButtonContainerUI(
                scene,
                some >= 0 && some <= 9 ? ButtonType.Number : ButtonType.Character,
                some,
                0, 0,
                this.say_hello)
            this.buttons.push(button)
        }

        let count = 0
        for (let y = 0; y < this.rows; ++y) {
            for (let x = 0; x < this.columns; ++x) {
                let button = this.buttons[count]
                if (button !== undefined) {
                    let width: number = button._width
                    let height: number = button._height
                    let value: number = +button.value
                    button.x = width * x
                    button.y = height * y
                }
                count++
            }
        }

        this.add(this.buttons)
    }

    private say_hello = () => {
        console.log("Show your bones!:" +  JSON.stringify(this, null, 3))
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
