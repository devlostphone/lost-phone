import ButtonRectUI from '~/lib/ui/gameObjects/ButtonRectUI';
import ButtonContainerUI from '~/lib/ui/gameObjects/ButtonContainerUI';

declare global
{
    namespace Phaser.GameObjects
    {
        interface GameObjectFactory
        {
            calcpad(x: number, y: number, target: any): CalculatorPadUI
        }
    }
}

export default class CalculatorPadUI extends Phaser.GameObjects.Container
{
    private buttons: ButtonContainerUI[] = []
    private rows: number = 1
    private columns: number = 2
    private target: any

    public constructor (scene: Phaser.Scene, x: number, y: number, target: any) {
        super(scene, x, y)
        this.target = target
        let keypad_values: any[] = [
            {
                name : 'AC',
                shape : {
                    kind: 'rect',
                    radius: 32
                },
                color : 0xff00ff
            },
            {
                name : '+/-',
                shape : {
                    kind: 'rect',
                    radius: 48
                },
                color : 0x00ff00
            }
        ]
        keypad_values.forEach( (element) => {
            for (let [key, value] of Object.entries(element)) {
                console.log(element.name);
                let buttonContainer: ButtonContainerUI = new ButtonContainerUI(
                    scene,
                    element.shape,
                    element.name,
                    0, 0,
                    (kollback: any) => {})

                buttonContainer.button.width = scene.width / this.columns
                buttonContainer.button.height = (scene.height / 2) / this.rows
                buttonContainer.button.onClick = this.saysomething.bind(this, buttonContainer)
                this.buttons.push(buttonContainer)            }

        });

        let count = 0
        for (let y = 0; y < this.rows; ++y) {
            for (let x = 0; x < this.columns; ++x) {
                let buttonContainer = this.buttons[count]
                if (buttonContainer !== undefined) {
                    let width: number = buttonContainer.button.width
                    let height: number = buttonContainer.button.height
                    let value: number = buttonContainer.value
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

// TODO: Find better name for calculator numpad? calcpad?
Phaser.GameObjects.GameObjectFactory.register('calcpad', function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    target: any
){
    const scene = this.scene
    const calcpad = new CalculatorPadUI(scene, x, y, target)
    scene.sys.displayList.add(calcpad)

    return calcpad
})
