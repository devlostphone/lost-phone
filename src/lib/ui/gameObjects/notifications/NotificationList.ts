import { FakeOS } from '~/scenes/FakeOS';
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
            this.add(new NotificationBox(
                this.fakeOS,
                this.fakeOS.width / 2,
                (i+1)*50,
                notifications[i]
            ));
        }
    }
}