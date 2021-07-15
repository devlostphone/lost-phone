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
    private rows: number = 5
    private columns: number = 4
    private target: any

    public constructor (scene: Phaser.Scene, x: number, y: number, target: any) {
        super(scene, x, y)
        this.target = target
        let key_values: any[] = ['AC', '%', '/', 7, 8, 9, 'x', 4, 5, 6, '-', 1, 2, 3, '+', 0, ',', '=']
        for (let key of key_values) {
            let buttonContainer: ButtonContainerUI = new ButtonContainerUI(
                scene,
                key >= 0 && key <= 9 ? ButtonType.Number : ButtonType.Character,
                key,
                0, 0,
                (key_values: any) => {})
            buttonContainer.button.width = scene.width / this.columns
            buttonContainer.button.height = (scene.height / 2) / this.rows
            buttonContainer.button.onClick = this.saysomething.bind(this, buttonContainer)
            this.buttons.push(buttonContainer)
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
