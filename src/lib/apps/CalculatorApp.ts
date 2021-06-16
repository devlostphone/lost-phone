
import { FakeOS } from '~/libscenes/FakeOS';
import App from '~/lib/apps/App';
import '~/lib/ui/gameObjects/CustomObjTemplate';
export default class CalculatorApp extends App {

    dank: any
    /**
     * Class constructor.
     *
     * @param scene
     */
    public constructor(scene: FakeOS) {
        super(scene);

    }

    /**
     * Render method.
     */
    public render(): void {
        this.dank = this.fakeOS.add.dank(0, 0).setOrigin(0.5).setScale(1)
        this.dank.play('spinning')
        this.dank.x = this.fakeOS.width / 2
        this.dank.y = this.fakeOS.height / 2
    }

    /**
     * Update method.
     *
     * @param delta
     * @param time
     */
    public update(delta: any, time: any): void {
        this.updateDank()
    }

    private updateDank() {
        // TODO:
        this.dank.x += this.dank.vx
        this.dank.y += this.dank.vy

        if (this.dank.y < 0) {
            this.dank.y = 0
            this.dank.vy *= -1
        }

        if (this.dank.y + 112 >= this.fakeOS.height) {
            this.dank.y = this.fakeOS.height - 112 - 1
            this.dank.vy *= -1
        }

        if (this.dank.x < 0) {
            this.dank.x = 0
            this.dank.vx *= -1
        }
        if (this.dank.x + 112 >= this.fakeOS.width) {
            this.dank.x = this.fakeOS.width - 112 - 1
            this.dank.vx *= -1
        }

    }

}
