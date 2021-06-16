import { FakeOS } from '~/scenes/FakeOS';

// TODO:

/**
 * INFO: Explore how to create UIbutton following this tutorial:
 * https://blog.ourcade.co/posts/2020/container-button-phaser-3-typescript-rxjs/
 * The concept is define a button as a container to hold a Button (image) and Text object.
 */

declare global
{
    interface IButton extends Phaser.GameObjects.GameObject, Phaser.GameObjects.Components.Transform
    {
        // onClick(): Phaser.Input.Pointer;
    }
}

export default class FeelsDankMan extends Phaser.GameObjects.Image {
    public constructor (
        scene: FakeOS,
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
