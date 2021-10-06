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
            buttonContainer(shape: string, label: string, x: number, y: number, size: number, color: number, callback = () => {}): ButtonContainerUI
        }
    }
}

export default class ButtonContainerUI extends Phaser.GameObjects.Container implements IButtonContainer
{
    public label: string
    public value: number | string;
    public button: ButtonArcUI | ButtonRectUI;
    public text: Phaser.GameObjects.Text

    public constructor (scene: Phaser.Scene,
                        shape: string = 'rect',
                        label: string = 'label',
                        x: number = 0, y: number = 0,
                        size: number = 64,
                        color: number = 0xff00ff,
                        callback =  () => {})
    {
        super(scene, x, y)

        if (shape === 'rect')
            // TODO: Unfinsihed constructor
            this.button = new ButtonRectUI(scene, 0, 0)
        if (shape === 'arc')
            this.button = new ButtonArcUI(scene, 0, 0, size, color, callback)

        // By default we set label at center of shape
        this.text = scene.add.text(0, 0, label).setOrigin(0.5)
        this.text.setFontFamily('Arial')
        this.text.setFontSize(48)
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
    color: number,
    onClick = () => {}
){
    const scene = this.scene
    const buttonContainer = new ButtonContainerUI(scene, shape, label, x, y, size, color, onClick);

    // TODO: Ask why we dont do this inside the class?
    buttonContainer.label = label;
    if (isNumber(buttonContainer.label)) buttonContainer.value = Number(buttonContainer.label);

    scene.sys.displayList.add(buttonContainer)

    return buttonContainer
})

// Stolen from: https://stackoverflow.com/a/50376498/553803
private function isNumber(value: string): boolean
{
    return ((value != null) &&
        (value !== '') &&
        !isNaN(Number(value.toString())));
}