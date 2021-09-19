import ButtonRectUI from '~/lib/ui/gameObjects/ButtonRectUI'
import ButtonArcUI from '~/lib/ui/gameObjects/ButtonArcUI'

declare global
{

    interface IButtonContainer extends Phaser.GameObjects.GameObject {
        // Do nothing at this moment
    }

    namespace Phaser.GameObjects
    {
        interface GameObjectFactory
        {
            buttonContainer(shape: string, label: string, x: number, y: number, size: number, color: number): ButtonContainerUI
        }
    }
}

export default class ButtonContainerUI extends Phaser.GameObjects.Container implements IButtonContainer
{
    public label: string
    public button: any
    public text: Phaser.GameObjects.Text

    public constructor (scene: Phaser.Scene,
                        shape: string = 'rect',
                        label: string = 'label',
                        x: number = 0, y: number = 0,
                        size: number = 64,
                        color: number = 0xff00ff)
    {
        super(scene, x, y)

        if (shape === 'rect')
            this.button = new ButtonRectUI(scene, 0, 0)
        if (shape === 'arc')
            this.button = new ButtonArcUI(scene, 0, 0, size, color)

        // By default we set label at center of shape
        this.text = scene.add.text(0, 0, label).setOrigin(0.5)
        this.text.setFontFamily('Arial')
        this.text.setFontSize(32)
        this.text.setScale(1)

        this.add(this.button)
        this.add(this.text)
    }
}

Phaser.GameObjects.GameObjectFactory.register('buttonContainer', function (
    this: Phaser.GameObjects.GameObjectFactory,
    shape: string,
    label: string,
    x: number,
    y: number,
    size: number,
    onClick: () => {}
){
    const scene = this.scene
    const buttonContainer = new ButtonContainerUI(scene, shape, label, x, y, size, onClick)
    scene.sys.displayList.add(buttonContainer)

    return buttonContainer
})
