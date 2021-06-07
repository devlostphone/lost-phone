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
        onClick(): Phaser.Input.Pointer;
    }
}

export default class Button extends Phaser.GameObjects.Image implements IButton
{
    public constructor(
        scene: FakeOS,
        x: number, y: number,
        texture: string,
        frame?: string | number
    ){
        super(scene, x, y, texture, frame);
    }

}

// we can also get a little fancy and augment Phaser's GameObjectFactory
// This will allow us to use a nicer, idiomatic syntax like: this.add.buttonContainer()

Phaser.GameObjects.GameObjectFactory.register(
    'button',
    function (
        this: Phaser.GameObjects.GameObjectFactory,
        x: number, y: number,
        texture: string,
        frame?: string | number
    ) {
        let  button = new Button(this.scene, x, y, texture, frame);

        this.displayList.add(button);
        this.updateList.add(button);

        return button;
    }
)
