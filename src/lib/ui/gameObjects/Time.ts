/**
 * Clock object.
 */
export default class Time extends Phaser.GameObjects.Text {

    /**
     * Class constructor.
     *
     * @param scene
     * @param x
     * @param y
     * @param font
     */
    public constructor(scene: Phaser.Scene, x: number, y: number, font: any) {
        super(scene, x, y, '', font);
        this.update();
        this.scene.add.existing(this);
    }

    /**
     * Updates the clock text.
     */
    public update(): void {
        let date = new Date();
        this.text = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;
    }
}
