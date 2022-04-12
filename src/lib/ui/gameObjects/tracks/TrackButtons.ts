import { FakeOS } from "../../../../scenes/FakeOS";
import { PhoneEvents } from "../../../../lib/events/GameEvents";

/**
 * Track buttons.
 * @todo: review this.
 */
export default class TrackButtons extends Phaser.GameObjects.Container
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
        track: any,
        textOptions: any
    ){
        super(scene, x, y, []);
        this.fakeOS = scene;
        let buttonOptions = {...textOptions}
        buttonOptions['fontSize'] = '48px';

        let previous_button = this.fakeOS.add.text(-150, 0, '⏮', buttonOptions);
        let play_button = this.fakeOS.add.text(-50, 0, '⏯', buttonOptions);
        let stop_button = this.fakeOS.add.text(50, 0, '⏹', buttonOptions);
        let next_button = this.fakeOS.add.text(150, 0, '⏭', buttonOptions);

        this.add([previous_button, play_button, stop_button, next_button]);

        this.fakeOS.addInputEvent(
            'pointerup',
            () => {
                this.fakeOS.launchEvent(PhoneEvents.TrackPlaying, track);
            },
            play_button
        );

        this.fakeOS.addInputEvent(
            'pointerup',
            () => {
                this.fakeOS.launchEvent(PhoneEvents.TrackStopped, track);
            },
            stop_button
        );

        this.fakeOS.addInputEvent(
            'pointerup',
            () => {
                this.fakeOS.launchEvent(PhoneEvents.TrackPrevious, track);
            },
            previous_button
        );

        this.fakeOS.addInputEvent(
            'pointerup',
            () => {
                this.fakeOS.launchEvent(PhoneEvents.TrackNext, track);
            },
            next_button
        );
    }
}