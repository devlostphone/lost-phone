import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';
import { PhoneEvents } from '../events/GameEvents';

/**
 * Mail app.
 */
 export default class MailApp extends App {

    /**
     * Mail list.
     */
    protected mails: any;

    protected textoptions = {
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
     * Renders the app.
     */
    public render(): void {
        //this.showTitle();
        this.showMailList();
    }

    /**
     * Shows the app title.
     */
    public showTitle(): void {
        this.addRow(this.fakeOS.add.text(0,0,this.fakeOS.getString('mail')));
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
                style = { color: '#FFF' };
            } else {
                style = { color: '#F00' };
            }
            let title = this.fakeOS.add.text(0,0,
                this.mails[i]['date'] + ' - ' +this.mails[i]['title'],
                {...style, ...this.textoptions}
            );

            this.addRow(title);

            this.fakeOS.addInputEvent(
                'pointerup',
                () => {
                    this.openMail(this.mails[i])
                },
                title
            );
        }
    }

    /**
     * Opens the mail contents.
     *
     * @param mail
     */
    public openMail(mail: any): void {

        // Adding a new layer for displaying mail contents.
        this.addLayer(0x333333);

        let header = this.fakeOS.add.text(0,0,
            this.fakeOS.getString('from') + ': ' + mail['from'] + "\n" +
            this.fakeOS.getString('subject') + ': ' + mail['subject'],
            this.textoptions
        ).setOrigin(0, 0);
        this.addRow(header);

        let text = this.fakeOS.add.text(0,0,
            mail['body'],
            this.textoptions
        ).setOrigin(0,0);
        this.addRow(text, {position: Phaser.Display.Align.TOP_CENTER});

        this.fakeOS.setDone(mail['id']);
    }

    public goToID(id: string): void {
        let mail = this.mails.find((o: any) => o.id == id);
        this.openMail(mail);
    }
}