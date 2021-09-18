import ButtonRectUI from '~/lib/ui/gameObjects/ButtonRectUI'
import ButtonArcUI from '~/lib/ui/gameObjects/ButtonArcUI'

declare global
{

    interface IButtonContainer extends Phaser.GameObjects.GameObject {
        // Nothing at this moment
    }

    namespace Phaser.GameObjects
    {
        interface GameObjectFactory
        {
            buttonContainer(shape: object, value: string, x: number, y: number, onClick: any): ButtonContainerUI
        }
    }
}

export default class ButtonContainerUI extends Phaser.GameObjects.Container implements IButtonContainer
{
    public value: string
    public button : ButtonRectUI
    public text: Phaser.GameObjects.Text

    public constructor (scene: Phaser.Scene, shape: object, value: any, x: number, y: number, onClickCallback: any)
    {
        super(scene, x, y)
        console.log('shape.kind? ' + shape.kind)
        if (shape.kind == 'rect')
            this.button = new ButtonRectUI(scene, 0, 0, onClickCallback)

        this.value = value

        this.text = scene.add.text(0, 0, value).setOrigin(0, 0.5)
        this.text.setFontFamily('Arial')
        this.text.setFontSize(96)
        this.text.setScale(1)

        this.add(this.button)
        this.add(this.text)
    }
}

Phaser.GameObjects.GameObjectFactory.register('buttonContainer', function (
    this: Phaser.GameObjects.GameObjectFactory,
    kind: any,
    value: string,
    x: number,
    y: number,
    onClick = () => {}
){
    const scene = this.scene
    const buttonContainer = new ButtonContainerUI(scene, kind, value, x, y, onClick)
    scene.sys.displayList.add(buttonContainer)

    return buttonContainer
})
