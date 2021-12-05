import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';

/**
 * Browser app.
 */
 export default class BrowserApp extends App {

    protected pages: any;
    protected pageList?: Phaser.GameObjects.GameObject;
    protected isListOpen: boolean;

    /**
     * Class constructor.
     *
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.pages = this.fakeOS.cache.json.get('browser');
        this.isListOpen = false;
    }

    public render() {

        let inputGraphics = this.fakeOS.add.graphics();
        inputGraphics.fillStyle(0xffffff, 1);
        inputGraphics.fillRoundedRect(
            this.area.width * 0.1,
            this.area.height / 3,
            this.area.width * 0.8,
            100,
            32
        );

        let inputBox = this.fakeOS.add.rectangle(
            this.area.width * 0.1,
            this.area.height / 3,
            this.area.width * 0.8,
            100,
        ).setOrigin(0);

        let down_arrow = this.fakeOS.add.text(
            (this.area.width * 0.9) - 48,
            (this.area.height / 3) + 50,
            '▼',
            { color: '0x000000', fontSize: '48px' }
        ).setOrigin(0.5);

        this.addElements([inputGraphics, inputBox, down_arrow]);

        this.fakeOS.addInputEvent('pointerup', () => {
            if (!this.isListOpen) {
                this.showPageList();
                this.isListOpen = true;
            } else {
                this.pageList?.destroy();
                this.isListOpen = false;
            }
        }, inputBox);
    }

    protected showPageList(): void {

    }
}