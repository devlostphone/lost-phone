import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';

/**
 * Notes app.
 */
export default class NotesApp extends App {

    protected notes: any;

    /**
     * Class constructor.
     *
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.notes = this.fakeOS.cache.json.get('notes');
    }

    /**
     * @inheritdoc
     */
    public render() {
        this.getActiveLayer().clear();
        this.setBackground();
        this.showHeader();
        this.listNotes();
    }

    /**
     * Shows the app title.
     */
    protected showHeader(): void {
        let container : Phaser.GameObjects.Container = this.fakeOS.add.container(0,0);
        let list : Phaser.GameObjects.Image = this.fakeOS.add.image(-this.fakeOS.getActiveApp().area.width / 2 + 32, 4, 'list-icon').setOrigin(0).setScale(1.25);
        let title = this.fakeOS.add.text(-this.fakeOS.getActiveApp().area.width / 2 + 300, -8, "Notes", {
            fontSize: "48px",
            align: "center",
            color: '#efefef',
            fontFamily: 'Roboto-Bold'
        }).setOrigin(0);
        let search = this.fakeOS.add.image(-this.fakeOS.getActiveApp().area.width / 2 + 564, 4, 'search-icon').setOrigin(0);
        let write = this.fakeOS.add.image(-this.fakeOS.getActiveApp().area.width / 2 + 640, 4, 'write-icon').setOrigin(0);
        let line = this.fakeOS.add.line(
            0,0,
            0,48,
            this.fakeOS.getActiveApp().area.width,48
        ).setStrokeStyle(100, 0x6f6f6f);

        container.add([list, title, search, write, line]);
        this.addRow(container);
    }

    /**
     * Shows the app title.
     */
    protected listNotes(): void {
        this.fakeOS.log(this.notes);
    }

    /**
     * Set app background
     */
    protected setBackground(image?: string): void {
        if (image !== undefined) {
            this.fakeOS.UI.setBackground(image);
        } else {
            let background = this.fakeOS.cache.json.get('apps').find(app => app.key == 'NotesApp').background;
            this.fakeOS.UI.setBackground(background);
        }
    }
}
