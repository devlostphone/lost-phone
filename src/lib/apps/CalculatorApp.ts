import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';
import ButtonContainer from '~/lib/ui/gameObjects/ButtonUI';
export default class CalculatorApp extends App {

    Orange:number;

    /**
     * Class constructor.
     *
     * @param scene
     */
    public constructor(scene: FakeOS) {
        super(scene);
        this.Orange = 0xFFAD00;
    }

    /**
     * Render method.
     */
    public render(): void {
        console.log("Calculatorapp.render()");
        const button = this.fakeOS.add.button(100, 100, 'app');
        // const button = new ButtonContainer(this.fakeOS, 128, 128, 'app', this.Orange);
        // const button = this.fakeOS.add.buttonContainer(128, 128, 'app', Orange).setText('Pepega!');

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
