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

    interface AmazingInput {
        name: string
        callback: (arg0: string) => void  // defining the callback
    }

    namespace Phaser.GameObjects
    {
        interface GameObjectFactory
        {
            button(x: number, y: number): ButtonUI
        }
    }
}



export default class ButtonUI extends Phaser.GameObjects.Rectangle implements IButton
{
    scene: Phaser.Scene
    target: any

    public constructor (
        scene: Phaser.Scene,
        x: number,
        y: number
    ) {
        super(scene, x, y)
        this.scene = scene
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
        this.on('pointerdown', () => {
            this.log(this)
        })
    }

    public sayHello() {
        console.log("Hello!")
    }

    private log(obj: object) {
        console.log(obj)
    }
}

Phaser.GameObjects.GameObjectFactory.register('button', function (

    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number){
    const scene = this.scene
    const button = new ButtonUI(scene, x, y)
    scene.sys.displayList.add(button)

    return button
})
