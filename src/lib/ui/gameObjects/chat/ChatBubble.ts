import { FakeOS } from '../../../../scenes/FakeOS';
/**
 * Chat bubble.
 * @todo: review this.
 */
export default class ChatBubble extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;
    protected ownColor = 0x009999;
    protected otherColor = 0x009900;
    protected statusColor = 0x999999;

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
        author: string|undefined,
        time: string|undefined,
        textOptions: any,
        position: string = 'left'
    ) {
        super(scene, x, y, []);
        this.fakeOS = scene;

        let offsetY = 20;
        let offsetX = 20;
        let timeOffset = 0;

        if (time !== undefined) {
            timeOffset = 20;
        }

        let bubble_text: any = this.fakeOS.add.text(
            0, 0,
            text,
            textOptions
        ).setOrigin(0.5);
        let bubble_author = this.fakeOS.add.text(
            0, 0,
            '',
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
                this.y += 20;
                bubble_text.y = -50;
                bubble_text.setOrigin(0.5, 0);
                bubble_text.displayWidth = this.fakeOS.getActiveApp().getActiveLayer().area.width / 2;
                bubble_text.scaleY = bubble_text.scaleX;
            }
            if (author !== undefined) {
                bubble_author.text =  author + ':\n';
                bubble_author.y = -68;
                offsetY += 20;
            }
        } else if (author !== undefined) {
            bubble_text.text = author + ':\n' + text;
        }

        let text_bounds = bubble_text.getBounds();
        let color = this.ownColor;

        if (position == 'left') {
            bubble_text.x = -this.fakeOS.getActiveApp().area.width/2 + text_bounds.width/2 + offsetX*3;
            bubble_author.x = -this.fakeOS.getActiveApp().area.width/2 + text_bounds.width/3;
            color = this.otherColor;
        } else if (position == 'right') {
            bubble_text.x = this.fakeOS.getActiveApp().area.width/2 - text_bounds.width/2 - offsetX*3;
        } else if (position == 'center') {
            color = this.statusColor;
        }
        text_bounds = bubble_text.getBounds();

        let bubble = this.fakeOS.add.graphics();
        bubble.fillStyle(color, 1);
        bubble.fillRoundedRect(
            bubble_text.x - bubble_text.width/2 - offsetX,
            bubble_text.y - bubble_text.height/2 - offsetY,
            text_bounds.width + (offsetX * 2),
            text_bounds.height + (offsetY * 2) + timeOffset,
            16
        );

        const left_bound = bubble_text.getBounds().width / 2;
        const top_bound = bubble_text.getBounds().height / 2;
        let triangle_coords = {
            x1: { x: - left_bound + bubble_text.x, y: - top_bound },
            x2: { x: - left_bound + bubble_text.x - 30, y: - top_bound },
            x3 :{ x: - left_bound + bubble_text.x, y: - top_bound + 25 }
        }

        if (position == 'right') {
            // TODO: why + 30?
            triangle_coords['x1']['x'] = left_bound + bubble_text.x + 30;
            triangle_coords['x2']['x'] = left_bound + bubble_text.x + 60;
            triangle_coords['x3']['x'] = left_bound + bubble_text.x + 30;
        }

        if (bubble_text instanceof Phaser.GameObjects.Image) {
            bubble.y = bubble_text.height / 2;
            bubble.x = bubble_text.width / 2 + bubble_text.x - offsetX*3;

            if (position == 'right') {
                bubble.x = bubble_text.width / 2 - bubble_text.x - offsetX*3;
            }

            triangle_coords['x1']['y'] = -offsetY;
            triangle_coords['x2']['y'] = -offsetY;
            triangle_coords['x3']['y'] = -offsetY + 25;
        }
        this.add(bubble);

        if (position != 'center') {
            let triangle = this.fakeOS.add.triangle(
                0,0,
                triangle_coords.x1.x, triangle_coords.x1.y,
                triangle_coords.x2.x, triangle_coords.x2.y,
                triangle_coords.x3.x, triangle_coords.x3.y,
                color
            );
            this.add(triangle);
        }

        this.add(bubble_text);
        if (bubble_author !== undefined) {
            this.add(bubble_author);
        }

        if (time !== undefined) {
            let timeText = this.fakeOS.add.text(
                left_bound + bubble_text.x,
                top_bound + 10,
                time
            ).setOrigin(1,0);
            this.add(timeText);

            if (bubble_text instanceof Phaser.GameObjects.Image) {
                timeText.y = top_bound - bubble_text.y*2 + 10;
            }
        }
    }
}