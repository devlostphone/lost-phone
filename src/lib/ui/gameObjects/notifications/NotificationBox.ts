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
        this.add(this.scene.add.text(0, 0, notification.title));
    }
 }