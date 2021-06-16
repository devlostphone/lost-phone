import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';
import FeelsDankMan from '~/lib/ui/gameObjects/ButtonUI';
export default class CalculatorApp extends App {

    /**
     * Class constructor.
     *
     * @param scene
     */
    public constructor(scene: FakeOS) {
        super(scene);

        // TODO: Needs to place it on a new file that handles custom objects list
        Phaser.GameObjects.GameObjectFactory.register('dank', function (
            this: Phaser.GameObjects.GameObjectFactory,
            x: number,
            y: number) {
            const dank = new FeelsDankMan(scene, x, y)
            scene.sys.displayList.add(dank)
            return dank
        })
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
