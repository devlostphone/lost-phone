/**
 * Custom button object
 * @todo: need to be documented
 */

declare global
{
    interface IButton extends Phaser.GameObjects.GameObject, Phaser.GameObjects.Components.Transform
    {

    }
    namespace Phaser.GameObjects
    {
        interface GameObjectFactory
        {
            buttonRect(x: number, y: number, onClick: any): ButtonRectUI
        }
    }
}

export default class ButtonRectUI extends Phaser.GameObjects.Rectangle implements IButton
{
    scene: Phaser.Scene
    public onInputOver = () => {}
    public onInputOut = () => {}
    public onInputUp = () => {}
    public onClick = (val: any) => {}

    public constructor (
        scene: Phaser.Scene,
        x: number,
        y: number,
        onClick = () => {}
    ) {
        super(scene, x, y)

        this.scene = scene

        let ColorBackgroundOut: number = 0x0
        let ColorBackgroundOver: number = 0xffff00
        let ColorBackgroundUp: number = 0xff0000

        this.setInteractive()
        this.on('pointerover', () => {
            this.setFillStyle(ColorBackgroundOver)
            this.onInputOver()
        })
        this.on('pointerout', () => {
            this.setFillStyle(ColorBackgroundOut)
            this.onInputOut()
        })
        this.on('pointerup', () => {
            this.setFillStyle(ColorBackgroundUp)
            this.onInputUp()
        })
        this.on('pointerdown', () => {
            let val: any
            this.onClick(val)
        })
    }
}

Phaser.GameObjects.GameObjectFactory.register('buttonRect', function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    onClick = () => {} ){
    const scene = this.scene
    const buttonRect = new ButtonRectUI(scene, x, y, onClick)
    scene.sys.displayList.add(buttonRect)

    return buttonRect
})
