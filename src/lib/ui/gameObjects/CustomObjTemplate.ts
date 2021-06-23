/**
 * Simple custom object
 * @todo: comment code
 */

import { FakeOS } from 'scenes/FakeOS';

declare global
{
    interface IFeelsDankMan extends Phaser.GameObjects.GameObject, Phaser.GameObjects.Components.Transform
    {
        // onClick(): Phaser.Input.Pointer;
    }

    namespace Phaser.GameObjects
    {
        interface GameObjectFactory
        {
            dank(x: number, y: number): FeelsDankMan
        }
    }
}

export default class FeelsDankMan extends Phaser.GameObjects.Sprite implements IFeelsDankMan {

    animation: any
    vx: number
    vy: number
    speed: number

    public constructor (
        scene: Phaser.Scene,
        x: number,
        y: number
    ) {
        super(scene, x, y, 'dankDisco')
        this.animation = {
            key: 'spinning',
            frames: 'dankDisco',
            frameRate: 45,
            repeat: -1
        }
        this.anims.create(this.animation)
        this.speed = 4.0
        this.vx = Math.floor(Math.random() * 2) % 2 == 0 ? this.speed : -1 * this.speed
        this.vy = -0.5
    }

    public updateLocation = () => {
        if (this.scene instanceof FakeOS) {
            this.x += this.vx
            this.y += this.vy

            if (this.y < 0) {
                this.y = 0
                this.vy *= -1
            }

            if (this.y + 112 >= this.scene.height) {
                this.y = this.scene.height - 112 - 1
                this.vy *= -1
            }

            if (this.x < 0) {
                this.x = 0
                this.vx *= -1
            }
            if (this.x + 112 >= this.scene.width) {
                this.x = this.scene.width - 112 - 1
                this.vx *= -1
            }
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
