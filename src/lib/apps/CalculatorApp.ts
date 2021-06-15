
import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';
import Button from '~/lib/ui/gameObjects/ButtonUI';
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
        const button = this.fakeOS.add.button(100, 100);
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
