import { PhoneEvents } from '~/lib/events/GameEvents';
import { FakeOS } from '~/scenes/FakeOS';
/**
 * Text list.
 * @todo: review this.
 */
export default class TextList extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;
    protected num_items: number;

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
        y: number
    ) {
        super(scene, x, y, []);
        this.fakeOS = scene;
        this.num_items = 0;
    }

    public addItem(id: number, text: string) {

        let item_height = this.fakeOS.getActiveApp().area.height / 12;

        let item_background = this.fakeOS.add.rectangle(
            0, this.num_items * item_height,
            this.fakeOS.getActiveApp().area.width,
            item_height,
            0x666666
        ).setStrokeStyle(1, 0xffffff);

        let item_text = this.fakeOS.add.text(
            0, this.num_items * item_height,
            text,
            { fontSize: "28px"}
        ).setOrigin(0.5);

        this.fakeOS.addInputEvent('pointerup', () => {
            this.fakeOS.launchEvent(PhoneEvents.ItemSelected, id);
        }, item_background);

        this.add([item_background, item_text]);

        this.num_items++;
    }
}