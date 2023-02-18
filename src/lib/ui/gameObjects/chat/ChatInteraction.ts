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
        text: any,
        author: string|undefined,
        time: string|undefined,
        options: any = undefined
    ) {
        super(scene, x, y, []);
        this.fakeOS = scene;
        this.id = conversation_id;

        // Create background
        this.background = this.fakeOS.add.rectangle(
            0, 0,
            this.fakeOS.getActiveApp().area.width,
            this.fakeOS.getActiveApp().rowHeight()
        );
        this.add(this.background);

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
                        this.text = this.createText(text, author, time, options);
                        this.add(this.text);
                        this.fakeOS.launchEvent(PhoneEvents.NewConversation);
                    }
                );
            }
        } else {
            this.text = this.createText(text, author, time, options);
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
    public createText(text: string, author: string|undefined, time: string|undefined,  options: any) {

        let position = 'left';
        if (options['own_message'] !== undefined) {
            position = 'right';
        }
        if (options['notification'] !== undefined) {
            position = 'center';
        }

        return new ChatBubble(
            this.fakeOS,
            0, 0,
            text,
            author,
            time,
            options,
            position
        );
    }
}