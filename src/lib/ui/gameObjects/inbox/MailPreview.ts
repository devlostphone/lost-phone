import { FakeOS } from "../../../../scenes/FakeOS";

/**
 * Mail preview.
 * @todo: review this.
 */
export default class MailPreview extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;
    protected icon: Phaser.GameObjects.Image;
    protected from: Phaser.GameObjects.Text;
    protected subject: Phaser.GameObjects.Text;
    protected date: Phaser.GameObjects.Text;
    protected background: Phaser.GameObjects.Rectangle;

    /**
     * Class constructor.
     *
     * @param scene
     * @param x
     * @param y
     * @param media
     */
    public constructor(
        scene: FakeOS,
        x: number, y: number,
        mail: any,
        textOptions?: any
    ){
        super(scene, x, y, []);
        this.fakeOS = scene;
        this.setSize(
            this.fakeOS.getActiveApp().area.width,
            this.fakeOS.getActiveApp().rowHeight()
        );

        this.icon = this.fakeOS.add.image(
            -this.fakeOS.getActiveApp().area.width / 2,
            8,
            mail.icon).setOrigin(0);

        this.from = this.fakeOS.add.text(
            -this.fakeOS.getActiveApp().area.width / 2 + 64,
            4,
            mail.from,
            {
                fontSize: "26px",
                align: "left",
                color: '#6f6f6f',
                fontFamily: 'Roboto-Bold'
            }
        );
        this.subject = this.fakeOS.add.text(
            -this.fakeOS.getActiveApp().area.width / 2 + 64,
            32,
            mail.subject,
            textOptions
        );
        this.date = this.fakeOS.add.rexBBCodeText(
            -this.fakeOS.getActiveApp().area.width / 2 + 480 + (mail.offset * 8),
            32,
            mail.date,
            textOptions
        );

        let line = this.fakeOS.add.line(
            -16,0,
            -16,96,
            this.fakeOS.getActiveApp().area.width,96,
            0x3c3c3c
        );

        this.add([this.icon, this.from, this.subject, this.date, line]);
    }
}
