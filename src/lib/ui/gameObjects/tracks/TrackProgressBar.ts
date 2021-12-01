import { FakeOS } from "scenes/FakeOS";
import { PhoneEvents } from "~/lib/events/GameEvents";

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

        this.fakeOS.addInputEvent('pointerup', (pointer: any) => {
            let percentage = (pointer.worldX - this.fakeOS.getActiveApp().area.width * 0.1) / this.background.width;
            this.fakeOS.launchEvent(PhoneEvents.TrackPlayAt, track, percentage) ;
        }, this.background);

        /*this.fakeOS.addInputEvent('drag', (pointer:any, gameobject:any, dragX: any, dragY: any) => {
            if (gameobject != this.cursor) {
                return;
            }
            this.cursor.x = Math.round(Phaser.Math.Clamp(
                dragX,
                - this.background.width / 2,
                this.background.width / 2
            ));
        },
        this.cursor);
        this.fakeOS.addInputEvent('dragstart', (pointer:any, gameobject:any, dragX: any, dragY: any) => {
            this.isCursorBeingDragged = true;
         },
         this.cursor);
        this.fakeOS.addInputEvent('dragend', (pointer:any, gameobject:any, dragX: any, dragY: any) => {
            this.isCursorBeingDragged = false;
        },
        this.cursor);
        this.fakeOS.input.setDraggable(this.cursor);*/
    }

    public update_cursor(x: number) {
        this.cursor.x = (-this.background.width / 2) + x*this.background.width;
    }
}