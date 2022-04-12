import { FakeOS } from "scenes/FakeOS";
import { PhoneEvents } from "/src/lib/events/GameEvents";

/**
 * Track progress bar.
 * @todo: review this.
 */
export default class TrackProgressBar extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;
    protected track: any;
    public cursor: Phaser.GameObjects.Rectangle;
    protected background: Phaser.GameObjects.Rectangle;
    public isCursorBeingDragged: boolean;

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
        track: any
    ){
        super(scene, x, y, []);
        this.fakeOS = scene;
        this.track = track;
        this.isCursorBeingDragged = false;

        this.setSize(this.fakeOS.getActiveApp().area.width * 0.80, 20);

        this.background = this.fakeOS.add.rectangle(0,0,
            this.fakeOS.getActiveApp().area.width * 0.80,
            20, 0xcccccc
        );

        this.cursor = this.fakeOS.add.rectangle(
            - this.background.width / 2,
            0,
            10,
            30,
            0xffffff
        );

        this.add([this.background, this.cursor]);

        let seek_func = (pointer: any) => {
            if (this.isCursorBeingDragged) {
                let percentage = (pointer.worldX - this.fakeOS.getActiveApp().area.width * 0.1) / this.background.width;
                this.fakeOS.launchEvent(PhoneEvents.TrackPlayAt, track, percentage);
            }
        }

        this.fakeOS.addInputEvent('pointerdown', (pointer:any) => {
            this.isCursorBeingDragged = true;
            seek_func(pointer);
        }, this.background);
        this.fakeOS.addInputEvent('pointermove', seek_func);
        this.fakeOS.addInputEvent('pointerup', () => {
            this.isCursorBeingDragged = false;
        });
    }

    public update_cursor(x: number) {
        this.cursor.x = (-this.background.width / 2) + x*this.background.width;
    }
}