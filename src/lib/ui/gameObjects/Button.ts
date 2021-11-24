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

    protected arc: Phaser.GameObjects.Image;
    protected rect: Phaser.GameObjects.Image;
    protected capsule: Phaser.GameObjects.Image;
    public bg: Phaser.GameObjects.Image;
    public label: Phaser.GameObjects.Text;
    public sublabel: Phaser.GameObjects.Text;

    public constructor (scene: FakeOS,
                        shape: string,
                        label: string,
                        x: number = 0,
                        y: number = 0,
                        options: any = {})
    {
        super(scene, x, y);

        // Set shape button if label exists
        // if don't, fake that for align buttons on a grid
        if (label) {
            switch(shape) {
                case "arc":
                    this.arc = new Phaser.GameObjects.Image(scene, 0, 0, 'arc@144');
                    this.add(this.arc);
                    this.bg = this.arc;
                    break;
                case "rect":
                    this.rect = new Phaser.GameObjects.Image(scene, 0, 0, 'rect@144');
                    this.add(this.rect);
                    break;
                case "capsule":
                    this.capsule = new Phaser.GameObjects.Image(scene, 0, 0, 'capsule@144');
                    this.add(this.capsule);
                    break;
            }
        }

        // Set label button
        this.label = new Phaser.GameObjects.Text(scene, 0, 0, label, { fontFamily: 'Arial', fontSize: 72 });
        this.label.setColor('#000000');
        this.label.setOrigin(0.5);
        this.add(this.label);

        // Set sublabel button if exists on options
        if (options.hasOwnProperty('sublabel')) {
            this.sublabel = new Phaser.GameObjects.Text(scene, 0, 0, options.sublabel, { fontFamily: 'Arial', fontSize: 24});
            this.sublabel.setColor('#000000');
            this.sublabel.setOrigin(0.5);
            this.label.y -= 8
            this.sublabel.y = this.label.y + 42;
            this.add(this.sublabel);
        }

        // Set button position
        this.y = y;
        this.x = x;
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
