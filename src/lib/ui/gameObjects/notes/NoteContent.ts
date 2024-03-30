import { FakeOS } from "../../../../scenes/FakeOS";

/**
 * Note content.
 * @todo: review this.
 */
export default class NoteContent extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;
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
        note: any,
        textOptions?: any
    ){
        super(scene, x, y, []);
        this.fakeOS = scene;
        this.setSize(
            this.fakeOS.getActiveApp().area.width,
            this.fakeOS.getActiveApp().rowHeight()
        );
        let body = this.fakeOS.add.rexBBCodeText(
            -this.fakeOS.getActiveApp().area.width / 2 + 400 ,
            32,
            note.subject,
            {
                fontSize: "36px",
                align: "left",
                color: '#efefef',
                fontFamily: 'Roboto',
            }
        );

        this.add([body]);
    }
}
