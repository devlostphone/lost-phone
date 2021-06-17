/**
 * Custom button object
 * @todo: need to be documented
 */

declare global
{
    interface IButton extends Phaser.GameObjects.GameObject, Phaser.GameObjects.Components.Transform
    {
        // onClick(): Phaser.Input.Pointer;
        log(): void
    }

    namespace Phaser.GameObjects
    {
        interface GameObjectFactory
        {
            button(x: number, y: number): Button
        }
    }
}

export default class Button extends Phaser.GameObjects.Rectangle implements IButton
{
    public constructor (
        scene: Phaser.Scene,
        x: number,
        y: number
    ) {
        super(scene, x, y)
        this.setSize(128, 128)
        this.setFillStyle(0xff00ff) // set purple color
    }

    public log()
    {
        console.log("I'm a button!")
    }
}

Phaser.GameObjects.GameObjectFactory.register('button', function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number) {
    const scene = this.scene
    const button = new Button(scene, x, y)
    scene.sys.displayList.add(button)
    return button
})
