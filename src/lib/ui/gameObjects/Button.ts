import { FakeOS } from "../../../scenes/FakeOS";

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
                   size: string,
                   label: string,
                   x: number,
                   y: number,
                   option: any): any;
        }
    }
}

export default class Button extends Phaser.GameObjects.Container implements IButton {

    protected arc?: Phaser.GameObjects.Image;
    protected rect?: Phaser.GameObjects.Image;
    protected capsule?: Phaser.GameObjects.Image;
    public bg?: Phaser.GameObjects.Image;
    public label: Phaser.GameObjects.Text;
    public sublabel?: Phaser.GameObjects.Text;

    /**
     * Class constructor.
     *
     * @param scene
     * @param shape
     * @param size
     * @param label
     * @param x
     * @param y
     * @param options
     */
    public constructor (scene: Phaser.Scene,
                        shape: string,
                        size: string,
                        label: string = "",
                        x: number = 0,
                        y: number = 0,
                        options: any = {})
    {
        super(scene, x, y);

        let shapeSize: number;
        let fontSize: string;
        switch(size) {
            default:
            case "small" : shapeSize = 72 ; fontSize = '32px'; break;
            case "medium": shapeSize = 96 ; fontSize = '48px'; break;
            case "large" : shapeSize = 144; fontSize = '72px'; break;
        }

        // Set shape button if label exists
        // if don't, fake that for align buttons on a grid
        if (label) {
            switch(shape) {
                case "arc":
                    this.arc = new Phaser.GameObjects.Image(scene, 0, 0, 'arc@' + shapeSize);
                    this.add(this.arc);
                    this.bg = this.arc;
                    break;
                case "rect":
                    this.rect = new Phaser.GameObjects.Image(scene, 0, 0, 'rect@' + shapeSize);
                    this.add(this.rect);
                    break;
                case "capsule":
                    this.capsule = new Phaser.GameObjects.Image(scene, 0, 0, 'capsule@' + shapeSize);
                    this.add(this.capsule);
                    break;
            }
        }

        this.label = new Phaser.GameObjects.Text(scene, 0, 0, label, { fontFamily: 'RobotoCondensed', fontSize: fontSize });
        this.label.setColor('#000000');
        this.label.setOrigin(0.5);
        this.add(this.label);

        // Set sublabel button if exists on options
        if (options.hasOwnProperty('sublabel')) {
            this.sublabel = new Phaser.GameObjects.Text(scene, 0, 0, options.sublabel, { fontFamily: 'RobotoCondensed', fontSize: '24px'});
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
    size: string,
    label: string,
    x: number,
    y: number,
    options: any) {
    const scene = this.scene;
    const button = new Button(scene, shape, size, label, x, y, options);
    scene.sys.displayList.add(button);
    return button;
})
