import { PhoneEvents } from '../../../../lib/events/GameEvents';
import { FakeOS } from '../../../../scenes/FakeOS';
import ChatBubble from './ChatBubble';
/**
 * Chat interaction.
 * @todo: review this.
 */
export default class ChatInteraction extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;
    public id: string;
    protected background: Phaser.GameObjects.Rectangle;
    protected pic?: Phaser.GameObjects.Image;
    public text: any;

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
        conversation_id: string,
        avatar: any,
        text: any,
        author: string|undefined,
        options: any = undefined
    ) {
        super(scene, x, y, []);
        this.fakeOS = scene;
        this.id = conversation_id;

        if (author !== undefined) {
            text = author + ':\n' + text;
        }

        // Create background
        this.background = this.fakeOS.add.rectangle(
            0, 0,
            this.fakeOS.getActiveApp().area.width,
            this.fakeOS.getActiveApp().rowHeight()
        );
        this.add(this.background);

        // Create avatar
        if (avatar != null) {
            let avatar_x = - this.fakeOS.getActiveApp().area.width * 0.3;
            if (options['own_message'] !== undefined && options['own_message']) {
                avatar_x = this.fakeOS.getActiveApp().area.width * 0.3;
            }

            this.pic = this.fakeOS.add.image(avatar_x, 0, avatar);
            this.add(this.pic);
        }

        // Create interaction
        if (options['new_message'] !== undefined && options['new_message']) {
            this.fakeOS.log('New chat interaction: ' + this.id);
            this.text = this.fakeOS.add.sprite(0, 0, 'typing').play('typingAnimation');

            if (options['choose'] !== undefined && options['choose']) {
                this.fakeOS.time.delayedCall(
                    600,
                    () => {
                        this.fakeOS.launchEvent(PhoneEvents.ShowOptions);
                    }
                );
            } else {
                this.fakeOS.time.delayedCall(
                    1500,
                    () => {
                        this.remove(this.text, true);
                        this.text = this.createText(text, options);
                        let text_bounds = this.text.getBounds();
                        if (this.pic !== undefined && text_bounds.height > this.pic.height) {
                            this.pic.y = text_bounds.height + text_bounds.y - this.pic.height ;
                        }
                        this.add(this.text);
                        this.fakeOS.launchEvent(PhoneEvents.NewConversation);
                    }
                );
            }
        } else {
            this.text = this.createText(text, options);
        }

        let text_bounds = this.text.getBounds();
        if (this.pic !== undefined && text_bounds.height > this.pic.height) {
            this.pic.y = text_bounds.height + text_bounds.y - this.pic.height ;
        }

        this.add(this.text);

    }

    /**
     * Sets the interaction text.
     *
     * @param text
     */
    public setText(text: any) {
        this.text = text;
        this.add(text);
    }

    /**
     * Creates text bubble.
     *
     * @param text
     * @param options
     * @returns
     */
    public createText(text: string, options: any) {

        let bubble_x = 100;
        if (options['own_message'] !== undefined && options['own_message']) {
            bubble_x = -100;
        }

        if (options['notification'] !== undefined) {
            bubble_x = 0;
        }

        let position = 'left';
        if (options['own_message'] !== undefined) {
            position = 'right';
        }
        if (options['notification'] !== undefined) {
            position = 'center';
        }

        return new ChatBubble(
            this.fakeOS,
            bubble_x, 0,
            text,
            options,
            position
        );
    }
}