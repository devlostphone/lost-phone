import { FakeOS } from '../../scenes/FakeOS';
import MailApp from './MailApp';
import { PhoneEvents } from '../events/GameEvents';

/**
 * Notes app.
 */
export default class NotesApp extends MailApp {

    /**
     * Class constructor.
     *
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.mails = this.fakeOS.cache.json.get('notes');
    }

    /**
     * @inheritdoc
     */
    public render() {
        this.getActiveLayer().clear();
        this.setBackground();
        this.showHeader();
        this.showMailList();
    }

    /**
     * Shows the app title.
     */
    protected showHeader(): void {
        let title = this.fakeOS.getString('notes');

        this.getActiveLayer().add([
            this.fakeOS.add.text(this.fakeOS.width / 2, 48, title, { color: '#fff', fontFamily: 'Roboto-Bold', fontSize: '28px', align: 'center'}).setOrigin(0.5),
        ]);

        // Paint a simple horizontal line
        this.getActiveLayer().add(
            this.fakeOS.add.line(
                16, 120,
                0, 0,
                this.fakeOS.width - 32, 0,
                0xefefef
            ).setLineWidth(0.75).setOrigin(0));
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
