
import { FakeOS } from '~/libscenes/FakeOS';
import App from '~/lib/apps/App';
import '~/lib/ui/gameObjects/CustomObjTemplate';
export default class CalculatorApp extends App {

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
        const dank = this.fakeOS.add.dank(128, 128).setOrigin(0).setScale(0.25)
    }

    /**
     * Update method.
     *
     * @param delta
     * @param time
     */
    public update(delta: any, time: any): void {

    }

}
