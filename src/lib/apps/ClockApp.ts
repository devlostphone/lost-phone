import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';

/**
 * Clock app
 */
export default class ClockApp extends App {

    /**
     * Clock size.
     */
    clockSize: number;

    /**
     * Clock size.
     */
    clockRadius: number;

    /**
     * Size.
     */
    size?: number;

    /**
     * Dest.
     */
    dest?: any;

    /**
     * Hour Hand.
     */
    hour_hand?: any;

    /**
     * Minute Hand.
     */
    minute_hand?: any;

    /**
     * Hour Hand.
     */
    second_hand?: any;

    /**
     * Class constructor.
     *
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.x = this.area.width / 2;
        this.y = this.area.height / 2;
        this.clockSize = Math.round(this.area.width / 1.15);
        this.clockRadius = 255;
    }

    /**
     * @inheritdoc
     */
    public render(): void {
        this.getActiveLayer().clear();
        this.setBackground();
        this.renderClock();
        this.update();
    }

    protected renderClock(): void {
        // Draw basic case
        this.getActiveLayer().add(
            new Phaser.GameObjects.Ellipse(this.fakeOS, this.x, this.y, this.clockSize, this.clockSize, 0x181818).
                setStrokeStyle(16, 0x181818)
        );
        // Set hour hand
        this.hour_hand = new Phaser.GameObjects.Line(this.fakeOS, this.x, this.y, 0, 0, 30, 192, 0x00ff00).setOrigin(1).setLineWidth(3,12);
        // Set minute hand
        this.minute_hand = new Phaser.GameObjects.Line(this.fakeOS, this.x, this.y, 0, 0, 30, 224, 0xff0000).setOrigin(1).setLineWidth(2,8);
        // Set second hand
        this.second_hand = new Phaser.GameObjects.Line(this.fakeOS, this.x, this.y, 0, 0, 30, 256, 0x00ffff).setOrigin(1).setLineWidth(1,5);

        // Stack based display clock hands
        this.getActiveLayer().add(this.hour_hand);
        this.getActiveLayer().add(this.minute_hand);
        this.getActiveLayer().add(this.second_hand);

        // Draw hour markers
        for (let i = 0; i < 12; i++) {
            let angle: number = (i / 12.0) * 2 * Math.PI; // Calculate the angle for each hour marker
            let x: number = this.x + this.clockRadius * Math.sin(angle);
            let y: number = this.y - this.clockRadius * Math.cos(angle);
            let hour_number: number = i == 0 ? 12 : i; // This is the way
            this.getActiveLayer().add([
                new Phaser.GameObjects.Ellipse(this.fakeOS, x, y, 64, 64, 0xffffff),
                new Phaser.GameObjects.Text(this.fakeOS, x, y, hour_number, {
                    fontFamily: 'RobotoCondensed',
                    color: 0x181818,
                    fontSize: '32px',
                    fontStyle: '900',
                    baselineY: 1}).setOrigin(0.5)
                ]
            );
        };
    }

    /**
     * @inheritdoc
     */
    public update(delta: any, time: any): void {
        const now = new Date();

        // Calculate rotation angles
        const hours_angle = (now.getHours() % 12 + now.getMinutes() / 60) * (Math.PI / 6);
        const minutes_angle = (now.getMinutes() + now.getSeconds() / 60) * (Math.PI / 30);
        const seconds_angle = (now.getSeconds() + now.getMilliseconds() / 1000) * (Math.PI / 30);

        // Rotate clock hands
        this.hour_hand.setRotation(hours_angle);
        this.minute_hand.setRotation(minutes_angle);
        this.second_hand.setRotation(seconds_angle);
    }

    /**
     * Set app background
     */
    protected setBackground(image?: string): void {
        if (image !== undefined) {
            this.fakeOS.UI.setBackground(image);
        } else {
            let background = this.fakeOS.cache.json.get('apps').find((app: any) => app.key == 'ClockApp').background;
            this.fakeOS.UI.setBackground(background);
        }
    }

}
