import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';
import MailPreview from '../ui/gameObjects/inbox/MailPreview.ts';

/**
 * Mail app.
 */
export default class MailApp extends App {

    /**
     * Mail list.
     */
    protected mails: any;
    /**
     * Class constructor.
     *
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.mails = this.fakeOS.cache.json.get('mail');
    }

    /**
     * @inheritdoc
     */
    public render(): void {
        this.currentMail = "";
        this.getActiveLayer().clear();
        this.setBackground();
        this.showHeader();
        this.showInbox();
    }

    /**
     * Show header at top
     */
    protected showHeader(): void {
        this.addRow([
            this.fakeOS.add.text(this.fakeOS.width / 2, 48, "Safata d'entrada", { color: '#fff', fontFamily: 'Roboto-Bold', fontSize: '28px', align: 'center'}).setOrigin(0.5),
        ]);
    }

    /**
     * Show list of mails from Inbox
     */
    protected showInbox(): void {
        for (let i=0; i < this.mails.length; i++) {
            this.fakeOS.log(this.mails[i]['date']);
            let mail = new MailPreview(this.fakeOS, 0, 0, this.mails[i], this.textOptions);
            this.addRow(mail);

        }
    }

    /**
     * Set app background
     */
    protected setBackground(image?: string): void {
        if (image !== undefined) {
            this.fakeOS.UI.setBackground(image);
        } else {
            let background = this.fakeOS.cache.json.get('apps').find((app: any) => app.key == 'MailApp').background;
            this.fakeOS.UI.setBackground(background);
        }
    }
}
