import { FakeOS } from '../../../scenes/FakeOS';
import Button from './Button';
/**
 * Bottom menu.
 * @todo: review this.
 */
export default class BottomMenu extends Phaser.GameObjects.Container
{

    protected buttons: any = [];

    /**
     * Class constructor.
     *
     * @param scene
     * @param appConfig
     * @param x
     * @param y
     * @param texture
     * @param frame
     */
     public constructor(
        scene: FakeOS,
        x: number,
        y: number,
        menus: any
    ){
        super(scene, x, y, []);

        for (let i = 0; i < menus.length; i++) {
            let button_position_x = ((scene.getActiveApp().area.width / menus.length) * i)
                - (scene.getActiveApp().area.width / 2)
                + scene.getActiveApp().area.width / menus.length / 2;
            let button_position_y = scene.getActiveApp().area.height - 130;
            let button = new Button(
                scene,
                'arc',
                'small',
                scene.getString(menus[i].text),
                button_position_x,
                button_position_y
            );
            scene.addInputEvent('pointerup',
                () => {
                    menus[i].launches.call(scene.getActiveApp());
                },
                button,
                new Phaser.Geom.Rectangle(
                    -48,
                    -48,
                    96, 96
                    ),
                    Phaser.Geom.Rectangle.Contains
            );
            //scene.input.enableDebug(button);
            this.buttons.push(button);
        }

        this.add(this.buttons);
        scene.add.existing(this);
    };
}