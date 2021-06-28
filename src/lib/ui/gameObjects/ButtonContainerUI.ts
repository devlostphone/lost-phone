declare global
{
    namespace Phaser.GameObjects
    {
        interface GameObjectFactory
        {
            buttonContainer(): ButtonContainer
        }
    }
}

export default class ButtonContainer extends Phaser.GameObjects.Container
{
    scene: Phaser.Scene

    public constructor (scene: Phaser.Scene)
    {
        super(scene)
        this.scene = scene
    }
}

Phaser.GameObjects.GameObjectFactory.register('buttonContainer', function (
    this: Phaser.GameObjects.GameObjectFactory
){
    const scene = this.scene
    const buttonContainer = new ButtonContainer(scene)
    scene.sys.displayList.add(buttonContainer)

    return buttonContainer
})
