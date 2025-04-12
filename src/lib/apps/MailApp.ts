import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';
import MailPreview from '../ui/gameObjects/inbox/MailPreview.ts';
import MailContent from '../ui/gameObjects/inbox/MailContent.ts';

/**
 * Mail app.
 */
export default class MailApp extends App {
    /**
     * Mail list.
     */
    protected mails: any;
    /**
     * Text style options.
     */
    protected textHeaderStyle: any = {
        fontSize: "32px",
        align: "center",
        color: '#efefef',
        fontFamily: 'Roboto-Bold'
    };

    protected textRegularStyle: any = {
        fontSize: "24px",
        align: "left",
        color: '#efefef',
        fontFamily: 'Roboto-Bold',
        wordWrap: { width: this.fakeOS.width - 50, useAdvancedWrap: true }
    };

    protected textStyleMailread: any = {
        fontSize: "24px",
        align: "left",
        color: '#6f6f6f',
        fontFamily: 'Roboto'
    };

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
        this.getActiveLayer().clear();
        this.setBackground();
        this.showHeader();
        this.showInbox();
    }

    /**
     * Show header at top
     */
    protected showHeader(): void {
        let container : Phaser.GameObjects.Container = this.fakeOS.add.container(0,0);
        let list : Phaser.GameObjects.Image = this.fakeOS.add.image(-this.fakeOS.getActiveApp().area.width / 2 + 32, -32, 'list-icon').setOrigin(0).setScale(1.25);
        let inbox = this.fakeOS.add.text(-this.fakeOS.getActiveApp().area.width / 2 + 248, -32, "Safata d'entrada", this.textHeaderStyle).setOrigin(0);
        let search = this.fakeOS.add.image(-this.fakeOS.getActiveApp().area.width / 2 + 564, -32, 'search-icon').setOrigin(0);
        let write = this.fakeOS.add.image(-this.fakeOS.getActiveApp().area.width / 2 + 640, -32, 'write-icon').setOrigin(0);

        let updateNow = this.fakeOS.add.text(-this.fakeOS.getActiveApp().area.width / 2, 64, "Actualitzat ara mateix", {
            fontSize: "24px",
            align: "left",
            color: '#8f8f8f',
            fontFamily: 'Roboto-Bold'
        }).setOrigin(0);

        let inboxZero = this.fakeOS.add.text(-this.fakeOS.getActiveApp().area.width / 2 + 456, 64, "0 missatges no llegits", {
            fontSize: "24px",
            align: "right",
            color: '#6A1B9A',
            fontFamily: 'Roboto-Bold'
        }).setOrigin(0);

        let line = this.fakeOS.add.line(
            0,0,
            0,111,
            this.fakeOS.getActiveApp().area.width,111
        ).setStrokeStyle(100, 0x6f6f6f);

        container.add([list, inbox, search, write, updateNow, inboxZero, line]);
        this.addRow(container);
    }

    /**
     * Show list of mails from Inbox
     */
    protected showInbox(): void {
        for (let i=0; i < this.mails.length; i++) {
            let mail: any = new MailPreview(this.fakeOS, 0, 0, this.mails[i], this.textStyleMailread);
            this.fakeOS.addInputEvent(
                'pointerup',
                () => {
                    this.openMail(this.mails[i])
                },
                mail
            );

            this.fakeOS.addInputEvent(
                'pointerover',
                () => {
                    for (let i = 1; i < 4; i++)
                        mail.getAt(i).setColor("#ffff00");
                },
                mail
            );

            this.fakeOS.addInputEvent(
                'pointerout',
                () => {
                    for (let i = 1; i < 4; i++)
                        mail.getAt(i).setColor("#acacac");
                },
                mail
            );
            this.addRow(mail);
        }
    }

    /**
     * Open and show mail content
     */

    protected openMail(mail: any): void {
        this.addLayer();
        var content: any = new MailContent(this.fakeOS, 0, 0, mail);
        this.getActiveLayer().add(content);
        this.addRow(content);

        // Add attachments if exists
        let attachments : Array = [];
        if (mail.attachment.length != 0) {
            for (let i = 0; i < mail.attachment.length; i++) {
                let attachment = this.fakeOS.add.image(0, 0, 'attachment-icon').setOrigin(0);
                // Add interaction
                this.fakeOS.addInputEvent(
                    'pointerup',
                    () => {
                        this.openAttachment(mail.attachment[i]);
                    },
                    attachment
                );

                attachments.push(attachment);
            }
        }
        this.addRow(attachments, {'offsetY' : 32});
    }

    /**
     * Display attachment
     */
    protected openAttachment(attachment): void {
        this.addLayer();
        let container = this.fakeOS.add.container(0, 0);
        let image = this.fakeOS.add.image(0, 0, attachment).setOrigin(0);
        container.add(image);
        this.getActiveLayer().add(container);
        this.addRow(container);
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
