import { FakeOS } from "scenes/FakeOS";

/**
 * Button Template.
 * @todo: review this.
 */

declare global {
    interface IButton extends Phaser.GameObjects.GameObject {
        // Do nothing at this moment
    }

    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            button(shape: string,
                   label: string,
                   x: number,
                   y: number,
                   option: any = {});
        }
    }
}

export default class Button extends Phaser.GameObjects.Container implements IButton {
    public constructor (scene: FakeOS,
                        shape: string,
                        label: string,
                        x: number = 0,
                        y: number = 0,
                        options: any = {})
    {
        super(scene, x, y);
    }
}

Phaser.GameObjects.GameObjectFactory.register('button', function (
    this: Phaser.GameObjects.GameObjectFactory,
    shape: string,
    label: string,
    x: number,
    y: number,
    options: any) {
    const scene = this.scene;
    const button = new Button(scene, shape, label, x, y, options);
    scene.sys.displayList.add(button);
    return button;
})
