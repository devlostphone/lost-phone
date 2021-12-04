import { FakeOS } from "scenes/FakeOS";

/**
 * Track preview.
 * @todo: review this.
 */
export default class TrackPreview extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;
    protected pic: Phaser.GameObjects.Image;
    protected trackName: Phaser.GameObjects.Text;
    protected duration: Phaser.GameObjects.Text;
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
        track: any,
        textOptions?: any
    ){
        super(scene, x, y, []);
        this.fakeOS = scene;

        this.setSize(
            this.fakeOS.getActiveApp().area.width,
            this.fakeOS.getActiveApp().rowHeight()
        );

        this.pic = this.fakeOS.add.image(
            - this.fakeOS.getActiveApp().area.width * 0.3,
            0,
            track.key
        ).setDisplaySize(100, 100);
        this.background = this.fakeOS.add.rectangle(
            0, 0,
            this.fakeOS.getActiveApp().area.width + 2,
            this.fakeOS.getActiveApp().rowHeight()
        );
        this.background.setStrokeStyle(1, 0xffffff);

        this.trackName = this.fakeOS.add.text(
            - this.fakeOS.getActiveApp().area.width * 0.1,
            -this.pic.height / 6,
            track.name,
            textOptions
        );
        let duration = this.fakeOS.sound.get(track.key).totalDuration;
        this.duration = this.fakeOS.add.text(
            - this.fakeOS.getActiveApp().area.width * 0.1,
            10,
            Math.floor(duration / 60) + ':' + Math.round(duration % 60),
            textOptions
        );
        this.add([this.background, this.pic, this.trackName, this.duration]);
    }
}