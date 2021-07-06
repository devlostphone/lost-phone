import ButtonUI from './ButtonUI'
import { ButtonType } from './ButtonUI'

declare global
{

    interface IButtonContainer extends Phaser.GameObjects.GameObject {
        // Nothing at this moment
    }

    namespace Phaser.GameObjects
    {
        interface GameObjectFactory
        {
            buttonContainer(kind: ButtonType, value: string, x: number, y: number, onClick: any): ButtonContainerUI
        }
    }
}

export default class ButtonContainerUI extends Phaser.GameObjects.Container implements IButtonContainer
{
    public value: string
    public button : ButtonUI
    public text: Phaser.GameObjects.Text

    public constructor (scene: Phaser.Scene, kind: ButtonType, value: any, x: number, y: number, onClickCallback: any)
    {
        super(scene, x, y)
        this.button = new ButtonUI(scene, kind, 0, 0, onClickCallback)
        this.value = value

        switch (kind) {
            case ButtonType.Emoji:
                // Do nothing at the moment
                break
            case ButtonType.Number:
                // Do something
                this.button.setFillStyle(0x00ff00)
                break
            case ButtonType.Character:
                // Do something
                this.button.setFillStyle(0x0000ff)
                break
        }

        this.text = scene.add.text(0, 0, value).setOrigin(0.5)
        this.text.setFontFamily('Arial')
        this.text.setFontSize(96)
        this.text.setScale(1)

        this.add(this.button)
        this.add(this.text)
    }
}

Phaser.GameObjects.GameObjectFactory.register('buttonContainer', function (
    this: Phaser.GameObjects.GameObjectFactory,
    kind: ButtonType,
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
