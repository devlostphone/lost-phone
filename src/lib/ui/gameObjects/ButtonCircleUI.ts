/**
 * Button Circle shape UI
 *
 */

declare global
{
    namespace Phaser.GameObjects
    {
        interface GameObjectFactory
        {
            buttonCircle(x: number, y: number, onClick: any): ButtonCircleUI
        }
    }
}

export default class ButtonCircleUI extends Phaser.GameObjects.Arc
{
    scene: Phaser.Scene
    public onInputOver = () => {}
    public onInputOut = () => {}
    public onInputUp = () => {}
    public onClick = () => {}

    public constructor (
        scene: Phaser.Scene,
        x: number,
        y: number,
        onClick = () => {}
    ) {
        super(scene, x, y)

        this.scene = scene
        this.onClick = onClick

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
            this.onClick()
        })
    }
}

Phaser.GameObjects.GameObjectFactory.register('buttonCircle', function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    onClick = () => {} ){
    const scene = this.scene
    const buttonCircle = new ButtonCircleUI(scene, x, y, onClick)
    scene.sys.displayList.add(buttonCircle)

    return buttonCircle
})
