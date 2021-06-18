/**
 * Custom button object
 * @todo: need to be documented
 */

declare global
{
    interface IButton extends Phaser.GameObjects.GameObject, Phaser.GameObjects.Components.Transform
    {
        // onClick(): Phaser.Input.Pointer;
    }

    namespace Phaser.GameObjects
    {
        interface GameObjectFactory
        {
            button(x: number, y: number, callback: () => void): ButtonUI
        }
    }
}

export default class ButtonUI extends Phaser.GameObjects.Rectangle implements IButton
{

    // ColorBackgroundOut: number
    // ColorBackgroundOver: number


    public constructor (
        scene: Phaser.Scene,
        x: number,
        y: number,
        callback: () => void
    ) {
        super(scene, x, y)

        let ColorBackgroundOut: number = 0xff00ff
        let ColorBackgroundOver: number = 0xffff00

        this.setSize(128, 128)
        this.setFillStyle(0xff00ff) // set purple color
        this.setInteractive()
        this.on('pointerover', () => {
            this.setFillStyle(ColorBackgroundOver)
        })
        this.on('pointerout', () => {
            this.setFillStyle(ColorBackgroundOut)
        })
        this.on('pointerdown', () => callback())

    }
}

Phaser.GameObjects.GameObjectFactory.register('button', function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    callback: () => void) {
    const scene = this.scene
    const button = new ButtonUI(scene, x, y, callback)
    scene.sys.displayList.add(button)
    return button
})
