import { FakeOS } from '../../scenes/FakeOS'
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
        this.fakeOS.UI.setWallpaper('solid-dark-grey-wallpaper');
        this.showHeader();
        this.showMailList();
    }

    /**
     * Shows the app title.
     */
    public showHeader(): void {
        let title = this.fakeOS.getString('mail');

        // Check for unread messages
        for (let i=0; i < this.mails.length; i++) {
            let id = this.mails[i]['id'];
            // Check if can be shown
            if (!this.fakeOS.checkDone(this.mails[i]['condition'])) continue;
            if (!this.fakeOS.checkDone(id)) this.unread_size += 1;            
        }
        
        let unread = this.unread_size + " no llegits";
        this.getActiveLayer().add([
            this.fakeOS.add.text(this.fakeOS.width / 2, 36, title, { color: '#fff', fontFamily: 'Roboto-Bold', fontSize: '28px', align: 'center'}).setOrigin(0.5),
            this.fakeOS.add.text(16, 64, "Actualitzat ara mateix" , { color: '#aaa', fontFamily: 'Roboto', fontSize: '22px', align: 'left'}),
            this.fakeOS.add.text(this.fakeOS.width - (unread.length * 9) - 16 , 64, unread , { color: '#c0c', fontFamily: 'Roboto', fontSize: '22px', align: 'right'})
        ]);
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
                this.unread_size += 1;
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

        // Reset unread_size
        this.unread_size = 0;

        this.currentMail = mail['id'];

        // Adding a new layer for displaying mail contents.
        this.addLayer(0x333333);

        // @TODO: Create solid background color for draggable or scrollable mail messages
        // this.setBackground();

        let header = this.fakeOS.add.text(16, 48, this.fakeOS.getString('from') + ': ' + mail['from'], this.textoptions);
        let subject = this.fakeOS.add.text(16, 84, this.fakeOS.getString('subject') + ': ' + mail['subject'], this.textoptions);

        this.getActiveLayer().add([header, subject]);

        let txt;
        // if (mail['file']) {
        //     fetch(mail['file'])
        //         .then((response) => response.text())
        //         .then((mailText) => {
        //             txt = this.fakeOS.add.text(16, 128,
        //                                        // mailText.split("\\n"),
        //                                        mail['body'],
        //                                         this.textoptions
        //                                        );
        //             // this.addRow(txt, {position: Phaser.Display.Align.TOP_CENTER});
        //         });
        // } else {
            txt = this.fakeOS.add.rexBBCodeText(16, 132, mail['body'], {
                fontFamily: 'Serif',
                fontSize: '24px',
                color: '#acacac',
                align: "left",
                lineSpacing: 12,
                wrap: { mode : 1, width: this.fakeOS.width - 32 },
                images: { g001: { width : 256  }}
            });
        // }

        this.addRow(txt, {position: Phaser.Display.Align.TOP_CENTER});
        // this.getActiveLayer().add(txt);
        // let attachments = [];
        // if (mail['attachment'] !== null) {
        //     for (let i = 0; i < mail['attachment'].length; i++) {
        //         let attachment = this.fakeOS.generateAppLink(mail['attachment'][i]);
        //         attachments.push(this.fakeOS.add.existing(attachment));

        //         // @TODO: change the way attachments look like
        //         attachment.setOrigin(0.5, 1)
        //         attachment.setScale(0.5, 0.5);
        //     }
        // }

        // this.addRow(attachments);
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
