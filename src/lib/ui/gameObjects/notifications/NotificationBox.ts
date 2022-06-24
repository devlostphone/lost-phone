import { PhoneEvents } from '../../../../lib/events/GameEvents';
import { FakeOS } from '../../../../scenes/FakeOS';
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
    protected littleIcon?: Phaser.GameObjects.Image;

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

        // Notification icon (check first for contact pic)
        if (notification.contact !== undefined) {
            this.icon = this.fakeOS.add.image(
                0,0, notification.contact
            ).setX(-220);
            this.add(this.icon);

            // Also add little app pic
            this.littleIcon = this.fakeOS.add.image(
                0,0,
                notification.type
            ).setScale(0.4, 0.4)
            .setX(-160)
            .setY(60);
            this.add(this.littleIcon);
        } else {
            this.icon = this.fakeOS.add.image(
                0,0, notification.type
            ).setX(-220);
            this.add(this.icon);
        }

        this.add(this.fakeOS.add.text(-100, 0, notification.title, { fontSize: "24px", wordWrap: {width: 400}}));
    }

    /**
     * Adds on click event to the notification icon.
     */
    public addOnIconClick(): void {
        this.fakeOS.addInputEvent('pointerup', () => {
            this.icon.setTint(185273);
            setTimeout(() => {
                this.fakeOS.log("Clicked on notification: " + this.id);
                this.icon.clearTint();

                // Only open app when phone unlocked
                if (this.fakeOS.checkDone('unlocked')) {
                    this.fakeOS.launchEvent(PhoneEvents.NotificationClicked, this.notification);
                } else {
                    this.fakeOS.cameras.main.shake(250);
                    window.navigator.vibrate(500);
                    this.fakeOS.getUI().elements.drawer?.hideDrawer();
                }
            }, 100);
        }, this.icon);
    }
 }