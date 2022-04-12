import { FakeOS } from '/src/scenes/FakeOS';
/**
 * Search box.
 * @todo: review this.
 */
export default class SearchBox extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;
    public background: Phaser.GameObjects.Rectangle;
    protected text: Phaser.GameObjects.Text;
    protected down_arrow: Phaser.GameObjects.Text;

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
        choices: any,
        textOptions: any = {}
    ) {
        super(scene, x, y, []);
        this.fakeOS = scene;

        this.background = this.fakeOS.add.rectangle(
            0,0,
            this.fakeOS.getActiveApp().area.width * 0.8,
            100,
            0xffffff
        ).setOrigin(0);

        this.text = this.fakeOS.add.text(
            (this.fakeOS.getActiveApp().area.width * 0.4),
            50,
            text,
            textOptions
        ).setOrigin(0.5);

        this.down_arrow = this.fakeOS.add.text(
            (this.fakeOS.getActiveApp().area.width * 0.8) - 48,
            50,
            '▼',
            {...textOptions, fontSize: '48px'}
        ).setOrigin(0.5);

        this.add([this.background, this.text, this.down_arrow])
    }

    public addText(text: string): void {
        if (text.length > 24) {
            text = text.substring(0, 24) + '...';
        }

        this.text.setText(text);
    }
}