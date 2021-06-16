declare global
{
    interface IButton extends Phaser.GameObjects.GameObject, Phaser.GameObjects.Components.Transform
    {
        // onClick(): Phaser.Input.Pointer;
    }
}

export default class FeelsDankMan extends Phaser.GameObjects.Image {
    public constructor (
        scene: Phaser.Scene,
        x: number,
        y: number
    ) {
        super(scene, x, y, 'dankDisco')
    }
}

declare global {
    namespace Phaser.GameObjects
    {
        interface GameObjectFactory
        {
            dank(x: number, y: number): FeelsDankMan
        }
    }
}

Phaser.GameObjects.GameObjectFactory.register('dank', function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number) {
    const scene = this.scene
    const dank = new FeelsDankMan(scene, x, y)
    scene.sys.displayList.add(dank)
    return dank
})
