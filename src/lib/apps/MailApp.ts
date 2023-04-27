import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';
import { PhoneEvents } from '../events/GameEvents';

/**
 * Mail app.
 */
export default class MailApp extends App {

    /**
     * Mail list.
     */
    protected mails: any;

    protected currentMail: string = "";

    protected textoptions = {
        fontFamily: 'Roboto',
        fontSize: "24px",
        align: "left",
        wordWrap: { width: this.fakeOS.width - 50, useAdvancedWrap: true }
    };

    protected unread_size: number = 0;

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
        this.showMailList();
    }

    /**
     * Set app background
     */
    protected setBackground(image?: string): void {
        if (image !== undefined) {
            this.fakeOS.UI.setBackground(image);
        } else {
            let wallpaper = this.fakeOS.cache.json.get('apps').find((app: any) => app.key == 'MailApp').wallpaper;
            this.fakeOS.UI.setBackground(wallpaper);
        }
    }

    /**
     * Shows the app title.
     */
    protected showHeader(): void {
        let title = this.fakeOS.getString('mail');

        // Check for unread messages
        for (let i=0; i < this.mails.length; i++) {
            let id = this.mails[i]['id'];
            // Check if can be shown
            if (!this.fakeOS.checkDone(this.mails[i]['condition'])) continue;
            if (!this.fakeOS.checkDone(id)) this.unread_size += 1;
        }

        // Display header mail info
        let unread = this.unread_size + " no llegits";
        this.getActiveLayer().add([
            this.fakeOS.add.text(this.fakeOS.width / 2, 48, title, { color: '#fff', fontFamily: 'Roboto-Bold', fontSize: '28px', align: 'center'}).setOrigin(0.5),
            this.fakeOS.add.text(16, 82, "Actualitzat ara mateix" , { color: '#aaa', fontFamily: 'Roboto', fontSize: '22px', align: 'left'}),
            this.fakeOS.add.text(this.fakeOS.width - (unread.length * 9) - 16 , 82, unread , { color: '#c0c', fontFamily: 'Roboto', fontSize: '22px', align: 'right'})
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
     * Prints the mail list.
     */
    protected showMailList(): void {
        let style = { color: '#F00' };

        for (let i=0; i < this.mails.length; i++) {
            let id = this.mails[i]['id'];

            // Check if can be shown
            if (!this.fakeOS.checkDone(this.mails[i]['condition'])) {
                continue;
            }

            // Check if already read
            if(this.fakeOS.checkDone(id)) {
                style = { color: '#8c8c8c' };
            } else {
                style = { color: '#fff' };
                this.unread_size += 1;
            }
            // @TODO: Rewrite this way of mail positioning
            let title = this.fakeOS.add.text(16, i * 72 + 158,
                                             this.mails[i]['date'] + ' - ' +this.mails[i]['title'],
                                             {...style, ...this.textoptions}
                                            );
            this.fakeOS.addInputEvent(
                'pointerup',
                () => {
                    this.openMail(this.mails[i])
                },
                title
            );

            // Paint a simple horizontal line
            let hl = this.fakeOS.add.line(
                16, i * 72 + 198,
                0, 0,
                this.fakeOS.width - 32, 0,
                0xacacac
            ).setLineWidth(0.35).setOrigin(0);

            this.getActiveLayer().add(title);
            this.getActiveLayer().add(hl);
        }
    }

    /**
     * Opens the mail contents.
     *
     * @param mail
     */
    protected openMail(mail: any): void {
        // Reset unread_size
        this.unread_size = 0;

        this.currentMail = mail['id'];

        // Adding a new layer for displaying mail contents.
        this.addLayer('solid-white');

        // Paint header, subject and other contextual information inside dark grey box
        this.getActiveLayer().add(
            new Phaser.GameObjects.Rectangle(this.fakeOS,
                                             0, 0,
                                             this.fakeOS.width, 192,
                                             0x1c1c1c
                                            ).setOrigin(0)
        );

        let subject = this.fakeOS.add.text(this.fakeOS.width / 2, 52, mail['subject'], {
            fontFamily: 'Roboto',
            fontSize: "32px",
            color: '#fff'
        }).setOrigin(0.5);
        let from_user = this.fakeOS.add.text(16, 92, mail['from'], {
            fontFamily: 'Roboto',
            fontSize: "24px",
            align: "left"
        });
        let date  = this.fakeOS.add.text(this.fakeOS.width - 16 - (mail['date'].length * 12), 92, mail['date'], {
            fontFamily: 'Roboto',
            fontSize: "24px",
            align: "right",
            color: '#ccc'
        });
        let to_user = this.fakeOS.add.rexBBCodeText(16, 132, '[b]' + this.fakeOS.getString('to') + '[/b]: [color=blue]' + mail['to'] + '[/color]', {
            fontFamily: 'Roboto',
            fontSize: "24px",
            align: "right",
            color: '#ccc'
});
        this.getActiveLayer().add([subject, from_user, date, to_user]);

        let txt;
        if (mail['file']) {
            fetch(mail['file'])
                .then((response) => response.text())
                .then((mailText) => {
                    txt = this.fakeOS.add.rexBBCodeText(0, 0,
                                                        mailText.split("\\n"),
                                                        {
                                                            fontFamily: 'Serif',
                                                            fontSize: '24px',
                                                            color: '#1c1c1c',
                                                            align: "left",
                                                            lineSpacing: 12,
                                                            wrap: { mode : 1, width: this.fakeOS.width - 72 }
                                                        });
                    this.addRow(txt, { y: 1});
                });
        } else {
            txt = this.fakeOS.add.rexBBCodeText(0, 0, mail['body'], {
                fontFamily: 'Serif',
                fontSize: '24px',
                color: '#1c1c1c',
                align: "left",
                lineSpacing: 12,
                wrap: { mode : 1, width: this.fakeOS.width - 72 }
            });
            this.addRow(txt, { y: 7 });
        }

        let attachments = [];
        if (mail['attachment'] !== null) {
            for (let i = 0; i < mail['attachment'].length; i++) {
                let attachment = this.fakeOS.generateAppLink(mail['attachment'][i]);
                attachments.push(this.fakeOS.add.existing(attachment));

                // @TODO: change the way attachments look like
                attachment.setOrigin(0.5, 1)
                attachment.setScale(0.5, 0.5);
            }
        }

        this.addRow(attachments);
        this.fakeOS.setDone(mail['id']);
    }

    /**
     * @inheritdoc
     */
    public goToID(id: string, skipLayerChangeAnim = false): void {
        this.skipLayerChangeAnim = skipLayerChangeAnim;
        let mail = this.mails.find((o: any) => o.id == id);
        this.openMail(mail);
    }

    /**
     * @inheritdoc
     */
    public getCurrentID(): string {
        return this.currentMail;
    }
}
