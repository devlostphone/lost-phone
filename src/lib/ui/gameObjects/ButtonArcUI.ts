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
            buttonArc(x: number, y: number, radius: number, onClick: any): ButtonArcUI
        }
    }
}

export default class ButtonArcUI extends Phaser.GameObjects.Arc
{
    scene: Phaser.Scene
    public onInputOver = () => {}
    public onInputOut = () => {}
    public onInputUp = () => {}
    public onClick = () => {}
    private ColorBackgroundOut: number = 0x3c3c3c
    private ColorBackgroundOver: number = 0xafafaf
    private ColorBackgroundUp: number = 0xffffff

    public constructor (
        scene: Phaser.Scene,
        x: number,
        y: number,
        radius: number,
        onClick = () => {}
    ) {
        super(scene, x, y, radius)

        this.scene = scene
        this.onClick = onClick
        this.setFillStyle(this.ColorBackgroundOut)

        // Set circle hit area
        let shape = new Phaser.Geom.Circle(radius, radius, radius);
        this.setInteractive(shape, Phaser.Geom.Circle.Contains);

        this.setInteractive()
        this.on('pointerover', () => {
            this.setFillStyle(this.ColorBackgroundOver)
            this.onInputOver()
        })
        this.on('pointerout', () => {
            this.setFillStyle(this.ColorBackgroundOut)
            this.onInputOut()
        })
        this.on('pointerup', () => {
            this.setFillStyle(this.ColorBackgroundUp)
            this.onInputUp()
        })
        this.on('pointerdown', () => {
            this.setFillStyle(this.ColorBackgroundOut)
            this.onClick()
        })
    }
}

Phaser.GameObjects.GameObjectFactory.register('buttonArc', function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    radius: number,
    onClick = () => {} ){
    const scene = this.scene
    const buttonArc = new ButtonArcUI(scene, x, y, radius, onClick)
    scene.sys.displayList.add(buttonArc)

    return buttonArc
})
