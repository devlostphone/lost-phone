import { FakeOS } from '~/scenes/FakeOS';
import { PhoneEvents } from '~/lib/events/GameEvents';
/**
 * App information box.
 * @todo: review this.
 */
export default class DownloadButton extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;
    protected background: Phaser.GameObjects.Rectangle;
    protected label: Phaser.GameObjects.Text;

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
        status: string
    ) {
        super(scene, x, y, []);
        this.fakeOS = scene;

        let text = this.fakeOS.getString(status);
        let line_color = Phaser.Display.Color.IntegerToColor(0x0000ff);

        this.label = this.fakeOS.add.text(0,0, text, {
            fontSize: '24px',
            color: line_color.rgba
        }).setOrigin(0.5);
        this.add(this.label);

        this.background = this.fakeOS.add.rectangle(
            0, 0,
            0, 0,
            0x999999
        ).setStrokeStyle(2, line_color.color).setOrigin(0.5);
        this.add(this.background);

        this.sendToBack(this.background);
        this.setLabel(status);
        this.setSize(this.background.width, this.background.height);
    }

    public setLabel(status: string): void {
        let text = this.fakeOS.getString(status);
        let line_color = Phaser.Display.Color.IntegerToColor(0x0000ff);

        if (status == 'installed') {
            line_color = Phaser.Display.Color.IntegerToColor(0x00ff00);
        } else if (status == 'unavailable') {
            line_color = Phaser.Display.Color.IntegerToColor(0x333333);
        }

        this.label.setText(text);
        this.label.setColor(line_color.rgba);

        let width = this.label.getBounds().width + 40;
        let height = this.label.getBounds().height + 20;

        this.background.setSize(width, height);
        this.background.setStrokeStyle(2, line_color.color);

        this.background.setOrigin(0.5);
    }

    public startDownload() {
        this.setLabel('downloading');

        this.fakeOS.time.delayedCall(
            3000,
            () => {
                this.setLabel('installed');
                this.fakeOS.launchEvent(PhoneEvents.Downloaded);
            }
        );
    }
}