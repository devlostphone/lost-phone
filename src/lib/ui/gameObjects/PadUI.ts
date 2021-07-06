import { ButtonType } from './ButtonUI'
import ButtonUI from './ButtonUI'
import ButtonContainerUI from './ButtonContainerUI'

declare global
{
    namespace Phaser.GameObjects
    {
        interface GameObjectFactory
        {
            numpad(x: number, y: number, target: any): PadUI
        }
    }
}

export default class PadUI extends Phaser.GameObjects.Container
{
    private buttons: ButtonContainerUI[] = []
    private rows: number = 3
    private columns: number = 5
    private target: any

    public constructor (scene: Phaser.Scene, x: number, y: number, target: any) {
        super(scene, x, y)
        this.target = target
        let val: any[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd']
        for (let some of val) {
            let button: ButtonContainerUI = new ButtonContainerUI(
                scene,
                some >= 0 && some <= 9 ? ButtonType.Number : ButtonType.Character,
                some,
                0, 0,
                (val: any) => {})
            button.button.onClick = this.saysomething.bind(this, button)
            this.buttons.push(button)
        }

        let count = 0
        for (let y = 0; y < this.rows; ++y) {
            for (let x = 0; x < this.columns; ++x) {
                let buttonContainer = this.buttons[count]
                if (buttonContainer !== undefined) {
                    let width: number = buttonContainer.button.width
                    let height: number = buttonContainer.button.height
                    let value: number = +buttonContainer.value
                    buttonContainer.x = width * x
                    buttonContainer.y = height * y
                }
                count++
            }
        }
        this.add(this.buttons)
    }

    private saysomething = (val: any) => {
        this.target.text += val.value
    }

}

Phaser.GameObjects.GameObjectFactory.register('numpad', function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    target: any
){
    const scene = this.scene
    const numpad = new PadUI(scene, x, y, target)
    scene.sys.displayList.add(numpad)

    return numpad
})
