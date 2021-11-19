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

        switch(shape) {
            case "arc":
                let arc = new Phaser.GameObjects.Image(scene, 0, 0, 'arc@144');
                this.add(arc);
                break;
            case "rect":
                let rect = new Phaser.GameObjects.Image(scene, 0, 0, 'rect@144');
                this.add(rect);
                break;
            case "capsule":
                break;
        }

        let text = new Phaser.GameObjects.Text(scene, 0, 0, label, { fontFamily: 'Arial', fontSize: 92 });
        text.setColor('#000000');
        text.setOrigin(0.5);
        this.add(text);
        this.y = y;
        this.x = 72;
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
