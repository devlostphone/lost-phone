/**
 * Custom button object
 * @todo: need to be documented
 */

export enum ButtonType {
    Number = '10',
    Character = '11',
    Symbol = '20',
    Emoji = '21'
}

declare global
{
    interface IButton extends Phaser.GameObjects.GameObject, Phaser.GameObjects.Components.Transform
    {

    }
    namespace Phaser.GameObjects
    {
        interface GameObjectFactory
        {
            button(kind: ButtonType, x: number, y: number): ButtonUI
        }
    }
}

export default class ButtonUI extends Phaser.GameObjects.Rectangle implements IButton
{
    scene: Phaser.Scene
    kind: ButtonType

    public constructor (
        scene: Phaser.Scene,
        kind: ButtonType,
        x: number,
        y: number
    ) {
        super(scene, x, y)

        this.scene = scene
        this.kind = kind

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
        this.on('pointerdown', () => this.doSomething())
    }

    public doSomething!: { (): void }

}

Phaser.GameObjects.GameObjectFactory.register('button', function (
    this: Phaser.GameObjects.GameObjectFactory,
    kind: ButtonType,
    x: number,
    y: number ){
    const scene = this.scene
    const button = new ButtonUI(scene, kind, x, y)
    scene.sys.displayList.add(button)

    return button
})
