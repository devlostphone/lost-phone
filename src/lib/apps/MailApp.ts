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
     * Shows the app title.
     */
    public showHeader(): void {
        let title = this.fakeOS.getString('mail');
        //@TODO Add dynamic value for unread mails
        let unread = "10 no llegits";
        this.getActiveLayer().add(
            this.fakeOS.add.text(this.fakeOS.width / 2, 36, title, { color: '#fff', fontFamily: 'Roboto-Bold', fontSize: '28px', align: 'center'}).setOrigin(0.5),
            this.fakeOS.add.text(16, 128, "Actualitzat ara mateix" , { color: '#aaa', fontFamily: 'Roboto', fontSize: '22px', align: 'left'}),
            this.fakeOS.add.text(this.fakeOS.width - (unread.length * 9) - 16 , 128, unread , { color: '#c0c', fontFamily: 'Roboto', fontSize: '22px', align: 'right'})
        );
    }

    /**
     * Prints the mail list.
     */
    public showMailList(): void {
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
            }
            // @TODO: Rewrite this way of mail positioning
            let title = this.fakeOS.add.text(16, i * 72 + 128,
                                             this.mails[i]['date'] + ' - ' +this.mails[i]['title'],
                                             {...style, ...this.textoptions}
                                            );

            // this.addRow(title);

            this.fakeOS.addInputEvent(
                'pointerup',
                () => {
                    this.openMail(this.mails[i])
                },
                title
            );

            this.getActiveLayer().add(title);
        }
    }

    /**
     * Opens the mail contents.
     *
     * @param mail
     */
    public openMail(mail: any): void {

        this.currentMail = mail['id'];

        // Adding a new layer for displaying mail contents.
        this.addLayer(0x333333);

        let header = this.fakeOS.add.text(0,0,
                                          this.fakeOS.getString('from') + ': ' + mail['from'] + "\n" +
            this.fakeOS.getString('subject') + ': ' + mail['subject'],
                                          this.textoptions
                                         ).setOrigin(0, 0);
        this.addRow(header);

        let text;

        if (mail['file']) {
            fetch(mail['file'])
                .then((response) => response.text())
                .then((mailText) => {
                    text = this.fakeOS.add.text(0,0,
                                                mailText.split("\\n"),
                                                this.textoptions
                                               ).setOrigin(0,0);
                    this.addRow(text, {position: Phaser.Display.Align.TOP_CENTER});
                });
        } else {
            text = this.fakeOS.add.text(0,0,
                                        mail['body'].split("\\n"),
                                        this.textoptions
                                       ).setOrigin(0,0)
            this.addRow(text, {position: Phaser.Display.Align.TOP_CENTER});
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


    /**
     * Set solid color as background based on day time
     *
     */
    protected setBackground(): void {
        let hours = new Date().getHours();
        if ( hours >= 9 && hours < 19 ) {
            this.wallpaper = this.fakeOS.add.image(0, 0, 'solid-light-grey-wallpaper', 0);
        } else {
            this.wallpaper = this.fakeOS.add.image(0, 0, 'solid-dark-grey-wallpaper', 0);
        }
        this.wallpaper.setOrigin(0, 0);
        this.wallpaper.setScale(
            this.fakeOS.width / this.wallpaper.width,
                    this.fakeOS.height / this.wallpaper.height
        );
        this.getActiveLayer().add(this.wallpaper);
    }
}
