import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';

/**
 * Calculator app
 */
export default class CalculatorApp extends App {
    /**
     * Class constructor.
     *
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.x = this.area.width / 2;
        this.y = this.area.height / 2;
    }

    /**
     * @inheritdoc
     */
    public render(): void {
        this.getActiveLayer().clear();
        this.setBackground();
        this.draw();
        this.update();
    }

    protected draw(): void {
        this.getActiveLayer().add(
            new Phaser.GameObjects.Ellipse(this.fakeOS, this.x, this.y, 256, 256, 0xff00ff).
                setStrokeStyle(16, 0x181818)
        );
    }

    /**
     * @inheritdoc
     */
    public update(delta: any, time: any): void {

    }

        /**
     * Set app background
     */
    protected setBackground(image?: string): void {
        if (image !== undefined) {
            this.fakeOS.UI.setBackground(image);
        } else {
            let background = this.fakeOS.cache.json.get('apps').find((app: any) => app.key == 'CalculatorApp').wallpaper;
            this.fakeOS.UI.setBackground(background);
        }
    }
}
