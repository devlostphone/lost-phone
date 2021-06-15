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

export default class Button extends Phaser.GameObjects.Image implements IButton {
    public constructor(
        scene: Phaser.Scene,
        x: number,
        y: number) {
      super(scene, x, y)
      this.fillStyle(0x770000).fillRect(x, y, 100, 100)
  }
}

declare global {
    namespace Phaser.GameObjects
    {
        interface GameObjectFactory
        {
            button(x: number, y: number): Button
        }
    }
}

Phaser.GameObjects.GameObjectFactory.register('button', function (x, y) {
    const button = new Button(this.scene, x, y)

    this.displayList.add(button)
    this.updateList.add(button)

    return button
})
