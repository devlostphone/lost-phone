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
            buttonContainer(kind: ButtonType, x: number, y: number): ButtonContainerUI
        }
    }
}

export default class ButtonContainerUI extends Phaser.GameObjects.Container implements IButtonContainer
{
    public button : ButtonUI
    private text: Phaser.GameObjects.Text

    public constructor (scene: Phaser.Scene, kind: ButtonType, x: number, y: number)
    {
        super(scene, x, y)
        this.button = new ButtonUI(scene, kind, 0, 0)
        this.button.doSomething = this.doSomething

        let text = "Undefined Type"
        switch (kind) {
            case ButtonType.Emoji:
                text = '\ud83d\ude03'
                break
            case ButtonType.Number:
                text = "0"
                break
            case ButtonType.Character:
                text = "@"
                break
        }
        this.text = scene.add.text(0, 0, text).setOrigin(0.5)
        this.text.setFontFamily('Arial')
        this.text.setFontSize(96)
        this.text.setScale(1)

        // this overrides all the buttons at the scene?
        this.button.on('pointerover', () => {
            this.text.setScale(2)
        })

        this.button.on('pointerout', () => {
            this.text.setScale(1)
        })

        this.add(this.button)
        this.add(this.text)
    }

    public doSomething!: { () : void }
}

Phaser.GameObjects.GameObjectFactory.register('buttonContainer', function (
    this: Phaser.GameObjects.GameObjectFactory,
    kind: ButtonType,
    x: number,
    y: number
){
    const scene = this.scene
    const buttonContainer = new ButtonContainerUI(scene, kind, x, y)
    scene.sys.displayList.add(buttonContainer)

    return buttonContainer
})
