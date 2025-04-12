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
        ).setOrigin(0.5, 0);
        let bubble_author = this.fakeOS.add.text(
            0, 0,
            '',
            {...textOptions, fontFamily: 'Roboto-Bold'}
        ).setOrigin(0.5, 0);

        let applink = this.fakeOS.generateAppLink(text, {
            ...textOptions,
            color: "#0000FF"
        });

        if (applink !== undefined) {
            bubble_text.destroy();
            bubble_text = this.fakeOS.add.existing(applink);
            bubble_text.setOrigin(0.5, 0);
            if (bubble_text instanceof Phaser.GameObjects.Image) {
                this.y += 20;
                bubble_text.displayWidth = this.fakeOS.getActiveApp().getActiveLayer().area.width / 2;
                bubble_text.scaleY = bubble_text.scaleX;

                // @TODO: NEED TO REWRITE THIS
                /*
                if (bubble_text.texture.key === 'mrodoreda') {
                    bubble_text.setScale(0.65);
                    }
                */

            }
            if (author !== undefined) {
                bubble_author.text =  author + ':\n';
                bubble_author.y = -30;
                offsetY += 20;
            }
        } else if (author !== undefined) {
            bubble_text.text = author + ':\n' + text;
        }

        let text_bounds = bubble_text.getBounds();
        let color = this.ownColor;

        if (position == 'left') {
            bubble_text.x = -this.fakeOS.getActiveApp().area.width/2 + text_bounds.width/2 + offsetX*3;
            bubble_author.x = -this.fakeOS.getActiveApp().area.width/2 + bubble_author.getBounds().width/2 + offsetX*3;
            color = this.otherColor;
        } else if (position == 'right') {
            bubble_text.x = this.fakeOS.getActiveApp().area.width/2 - text_bounds.width/2 - offsetX*3;
        } else if (position == 'center') {
            color = this.statusColor;
        }
        text_bounds = bubble_text.getBounds();

        let bubble = this.fakeOS.add.graphics();

        if (time !== undefined && bubble_text.width < 40) {
            bubble_text.width = 40;
            text_bounds.width = 40;
        }

        bubble.fillStyle(color, 1);
        if (bubble_text instanceof Phaser.GameObjects.Image) {
            if (bubble_text.texture.key === 'mrodoreda') {
                bubble.fillStyle(color, 0);
            }
        }

        bubble.fillRect(
            bubble_text.x - bubble_text.width/2 - offsetX,
            text_bounds.top  - offsetY,
            text_bounds.width + (offsetX * 2),
            text_bounds.height + (offsetY * 2) + timeOffset
        );

        const left_bound = bubble_text.getBounds().width / 2;
        const top_bound = bubble_text.getBounds().height / 2;
        let triangle_coords = {
            x1: { x: - left_bound + bubble_text.x, y: 0 },
            x2: { x: - left_bound + bubble_text.x - 30, y: 0 },
            x3 :{ x: - left_bound + bubble_text.x, y:  25 }
        }

        if (position == 'right') {
            triangle_coords['x1']['x'] = left_bound + bubble_text.x + 30;
            triangle_coords['x2']['x'] = left_bound + bubble_text.x + 60;
            triangle_coords['x3']['x'] = left_bound + bubble_text.x + 30;
        }

        if (bubble_text instanceof Phaser.GameObjects.Image) {
            bubble.x = bubble_text.width / 2 + bubble_text.x - offsetX*3;

            if (position == 'right') {
                bubble.x = bubble_text.width / 2 - bubble_text.x - offsetX*3;
            }
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
                top_bound * 2 + 10,
                time,
                {
                    align: "left",
                    color: '#fff',
                    fontFamily: 'Roboto',
                    fontSize: "22px"
                }
            ).setOrigin(1,0);
            this.add(timeText);
        }
    }
}
