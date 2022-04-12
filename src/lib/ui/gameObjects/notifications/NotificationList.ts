import { PhoneEvents } from '../../../../lib/events/GameEvents';
import { FakeOS } from '../../../../scenes/FakeOS';
import NotificationBox from './NotificationBox';
/**
 * Notification list.
 * @todo: review this.
 */
export default class NotificationList extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;

    /**
     * Class constructor.
     *
     * @param scene
     * @param x
     * @param y
     */
    public constructor(
        scene: FakeOS,
        x: number,
        y: number
    ) {
        super(scene, x, y, []);
        this.fakeOS = scene;
    }

    /**
     * Refreshes list of notifications.
     */
    public refreshNotifications(): void {
        this.removeAll(true);
        let notifications = this.fakeOS.registry.get('notifications');
        this.fakeOS.log('Total notifications: ' + notifications.length);

        for (let i=0; i<notifications.length; i++) {
            let notification = new NotificationBox(
                this.fakeOS,
                this.fakeOS.width / 2,
                (i+1)*200,
                notifications[i]
            );
            notification.addOnIconClick();
            this.add(notification);
        }
    }

    /**
     * Launches a new notification box.
     *
     * @param notification
     * @returns Whether the notification is already on the drawer list.
     */
    public launchNotification(notification: any): boolean {
        let child = this.getFirst('id', notification.id);
        if (child instanceof NotificationBox) {
            this.fakeOS.log("Yoyoing!");
            this.yoyo(new NotificationBox(
                this.fakeOS,
                this.fakeOS.width / 2,
                -200,
                notification
            ).setDepth(2000));
            return true;
        } else {
            return false;
        }
    }

    /**
     * Shows a bouncing notification.
     *
     * @param bouncingNotification
     */
    public yoyo(bouncingNotification: NotificationBox) {
        this.fakeOS.log('Yoyo-ing notification ' + bouncingNotification.id);
        this.fakeOS.add.existing(bouncingNotification);
        this.fakeOS.tweens.add({
            targets: bouncingNotification,
            y: 100,
            delay: 2500,
            duration: 700,
            yoyo: true,
            hold: 3000,
            onComplete: () => {
                bouncingNotification.destroy();
                this.fakeOS.launchEvent(PhoneEvents.NotificationFinished);
            }
        });
    }
}