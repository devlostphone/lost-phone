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

        this.add(this.fakeOS.add.rectangle(
            0,0,
            this.fakeOS.getActiveApp().area.width,
            200,
            0x666666
        ));

        this.add(this.fakeOS.add.image(
            0,0,'lorem-appsum'
        ).setX(-150));

        this.add(this.fakeOS.add.text(0, 0, notification.title));
    }
 }