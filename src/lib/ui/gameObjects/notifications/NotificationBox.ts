import { PhoneEvents } from '~/lib/events/GameEvents';
import { FakeOS } from '~/scenes/FakeOS';
/**
 * Notification box.
 * @todo: review this.
 */
export default class NotificationBox extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;
    /**
     * Notification ID
     */
    public id: string;
    public notification: any;
    protected icon: Phaser.GameObjects.Image;

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
        notification: any
    ) {
        super(scene, x, y, []);
        this.fakeOS = scene;
        this.id = notification.id;
        this.notification = notification;

        this.add(this.fakeOS.add.rectangle(
            0,0,
            this.fakeOS.getActiveApp().area.width,
            200,
            0x666666
        ));

        this.icon = this.fakeOS.add.image(
            0,0, this.fakeOS.debug ? 'lorem-appsum' : notification.type
        ).setX(-220);
        this.add(this.icon);

        this.add(this.fakeOS.add.text(-100, 0, notification.title, { fontSize: "24px", wordWrap: {width: 400}}));
    }

    public addOnIconClick(): void {
        this.fakeOS.addInputEvent('pointerup', () => {
            this.icon.setTint(185273);
            setTimeout(() => {
                this.icon.clearTint();
                this.fakeOS.launchEvent(PhoneEvents.NotificationClicked, this.notification);
            }, 100);
        }, this.icon);
    }
 }