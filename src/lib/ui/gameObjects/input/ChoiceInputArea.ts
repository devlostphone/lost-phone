import { PhoneEvents } from '../../../../lib/events/GameEvents';
import { FakeOS } from '../../../../scenes/FakeOS';
/**
 * Input area.
 * @todo: review this.
 */
export default class ChoiceInputArea extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;
    protected background: Phaser.GameObjects.Rectangle;

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
        choices: any,
        textOptions: any = {}
    ) {
        super(scene, x, y, []);
        this.fakeOS = scene;
        const text_offset = 40;

        this.background = this.fakeOS.add.rectangle(
            0, 0,
            this.fakeOS.getActiveApp().area.width,
            this.fakeOS.getActiveApp().rowHeight(),
            0x999999
        );
        this.add(this.background);

        let pos = - this.fakeOS.getActiveApp().rowHeight() / 2 + text_offset;
        for(const key in choices) {
            let option = this.fakeOS.add.text(
                0,
                pos,
                choices[key]['text'],
                textOptions
            ).setOrigin(0.5);
            this.fakeOS.addInputEvent('pointerover', () => { option.setTint(0x00cc00)}, option);
            this.fakeOS.addInputEvent('pointerout', () => { option.clearTint()}, option);
            this.fakeOS.addInputEvent('pointerup', () =>  {
                this.fakeOS.launchEvent(PhoneEvents.OptionSelected, key);
            }, option);

            pos += option.getBounds().height + text_offset;

            this.add(option);
        }

        this.background.height = pos + text_offset * 2;

        this.x = this.fakeOS.getActiveApp().area.width / 2;
        this.y = this.fakeOS.getActiveApp().area.height - pos;
    }
}