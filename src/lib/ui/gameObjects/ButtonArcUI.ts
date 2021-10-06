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
            buttonArc(x: number, y: number, radius: number, color: number, onClick = () => {}): ButtonArcUI
        }
    }
}

export default class ButtonArcUI extends Phaser.GameObjects.Arc
{
    scene: Phaser.Scene
    public value: number | string;
    public onInputOver = () => {}
    public onInputOut = () => {}
    public onInputUp = () => {}
    public onClick = () => {}
    // Set by default a weird colors
    public colorBackgroundOut: number = color
    public colorBackgroundOver: number = 0xffaaff
    public colorBackgroundUp: number = 0x000000

    public constructor (
        scene: Phaser.Scene,
        x: number,
        y: number,
        radius: number,
        color: number,
        onClick = () => {}
    ) {
        super(scene, x, y, radius)
        this.scene = scene
        this.onClick = onClick
        this.setFillStyle(this.colorBackgroundOut)

        // Set circle hit area
        let shape = new Phaser.Geom.Circle(radius, radius, radius);
        this.setInteractive(shape, Phaser.Geom.Circle.Contains);

        this.setInteractive()
        this.on('pointerover', () => {
            this.setFillStyle(this.colorBackgroundOver)
            this.onInputOver()
        })
        this.on('pointerout', () => {
            this.setFillStyle(this.colorBackgroundOut)
            this.onInputOut()
        })
        this.on('pointerup', () => {
            this.setFillStyle(this.colorBackgroundUp)
            this.onInputUp()
        })
        this.on('pointerdown', () => {
            this.setFillStyle(this.colorBackgroundOut)
            this.onClick()
        })
    }
}

Phaser.GameObjects.GameObjectFactory.register('buttonArc', function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    radius: number,
    color: number,
    onClick = () => {}){
    const scene = this.scene
    const buttonArc = new ButtonArcUI(scene, x, y, radius, color, onClick)
    scene.sys.displayList.add(buttonArc)

    return buttonArc
})
