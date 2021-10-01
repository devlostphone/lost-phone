/**
 * Notification box.
 * @todo: review this.
 */
export default class NotificationBox extends Phaser.GameObjects.Container
{
    /**
     * Class constructor.
     *
     * @param scene
     * @param x
     * @param y
     * @param notification
     */
    public constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        notification: any
    ) {
        super(scene, x, y, []);

        this.add(this.scene.add.text(0, 0, notification.title));
    }

    public yoyo() {

    }
 }