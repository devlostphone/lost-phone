import { FakeOS } from '../../../../scenes/FakeOS';
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
        position: string = 'left'
    ) {
        super(scene, x, y, []);
        this.fakeOS = scene;

        let offsetY = 20;
        let offsetX = 20;

        let bubble_text: any = this.fakeOS.add.text(
            0, 0,
            text,
            textOptions
        ).setOrigin(0.5);

        let applink = this.fakeOS.generateAppLink(text, {
            ...textOptions,
            color: "#0000FF"
        });

        if (applink !== undefined) {
            bubble_text.destroy();
            bubble_text = this.fakeOS.add.existing(applink);
            bubble_text.setOrigin(0.5);
            if (bubble_text instanceof Phaser.GameObjects.Image) {
                bubble_text.y = -50;
                bubble_text.setOrigin(0.5, 0);
                bubble_text.displayWidth = this.fakeOS.getActiveApp().getActiveLayer().area.width / 2;
                bubble_text.scaleY = bubble_text.scaleX;
            }
        }

        let text_bounds = bubble_text.getBounds();
        let bubble = this.fakeOS.add.rectangle(
            0, 0,
            text_bounds.width + (offsetX * 2),
            text_bounds.height + (offsetY * 2),
            0x999999
        );

        if (bubble_text instanceof Phaser.GameObjects.Image) {
            bubble.y = -50-offsetY;
            bubble.setOrigin(0.5, 0);
        }
        this.add(bubble);

        const left_bound = bubble.getBounds().width / 2 - offsetX;
        const top_bound = bubble.getBounds().height / 2 - offsetY;
        let triangle_coords = {
            x1: { x: - left_bound, y: top_bound + 5 },
            x2: { x: - left_bound - 30, y: top_bound + 30 },
            x3 :{ x: - left_bound, y: top_bound + 25 }
        }

        if (position == 'right') {
            // TODO: why + 30?
            triangle_coords['x1']['x'] = left_bound + 30;
            triangle_coords['x2']['x'] = left_bound + 60;
            triangle_coords['x3']['x'] = left_bound + 30;
        }

        if (position != 'center') {
            let triangle = this.fakeOS.add.triangle(
                0,0,
                triangle_coords.x1.x, triangle_coords.x1.y,
                triangle_coords.x2.x, triangle_coords.x2.y,
                triangle_coords.x3.x, triangle_coords.x3.y,
                0x999999
            );
            this.add(triangle);
        }

        this.add(bubble_text);
    }
}