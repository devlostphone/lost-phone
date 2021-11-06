import { FakeOS } from '~/scenes/FakeOS';
/**
 * Chat bubble.
 * @todo: review this.
 */
export default class ChatBubble extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;

    /**
     * Class constructor.
     *
     * @param scene
     * @param x
     * @param y
     * @param notification
     */
    public constructor(
        scene: FakeOS,
        x: number,
        y: number,
        text: string,
        textOptions: any,
        right: boolean = false

    ) {
        super(scene, x, y, []);
        this.fakeOS = scene;

        let bubble_x = -250;
        let bubble_y = -50;

        let triangle_coords = {
            x1: {x: 0, y: this.fakeOS.getActiveApp().rowHeight() - 15},
            x2: {x: -30, y: this.fakeOS.getActiveApp().rowHeight() - 10},
            x3 :{x: 0, y: this.fakeOS.getActiveApp().rowHeight() - 35}
        }

        if (right) {
            bubble_x = -120;
            bubble_y = -50;

            triangle_coords = {
                x1: {x: this.fakeOS.getActiveApp().area.width / 2, y: this.fakeOS.getActiveApp().rowHeight() - 15},
                x2: {x: this.fakeOS.getActiveApp().area.width / 2 + 30, y: this.fakeOS.getActiveApp().rowHeight() - 10},
                x3 :{x: this.fakeOS.getActiveApp().area.width / 2, y: this.fakeOS.getActiveApp().rowHeight() - 35}
            }
        }

        let bubble = this.add(this.fakeOS.add.rectangle(
            bubble_x, bubble_y,
            this.fakeOS.getActiveApp().area.width / 2,
            this.fakeOS.getActiveApp().rowHeight(),
            0x999999
        ).setOrigin(0,0));
        let triangle = this.add(this.fakeOS.add.triangle(
            bubble_x,bubble_y,
            triangle_coords.x1.x, triangle_coords.x1.y,
            triangle_coords.x2.x, triangle_coords.x2.y,
            triangle_coords.x3.x, triangle_coords.x3.y,
            0x999999
        ).setOrigin(0,0));
        let bubble_text = this.add(this.fakeOS.add.text(
            bubble_x + 20, bubble_y + 20,
            text,
            textOptions
        ).setOrigin(0,0));
    }
}