import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';

/**
 * Mail app.
 */
 export default class MailApp extends App {

    protected mails: any;

    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.mails = this.fakeOS.cache.json.get('mail')['mails'];
    }

    public render(): void {
        //this.showTitle();
        this.showMailList();
    }

    public showTitle(): void {
        this.addRow(this.fakeOS.add.text(0,0,this.fakeOS.getString('mail')));
    }

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
            let title = this.fakeOS.add.text(0,0, this.mails[i]['date'] + ' - ' +this.mails[i]['title'], style);

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

    public openMail(mail: any): void {

        // Adding a new layer for displaying mail contents.
        this.addLayer();
        let text = this.fakeOS.add.text(0,0,
            mail['body'],
            {wordWrap: { width: this.fakeOS.width - 50, useAdvancedWrap: true }}
        ).setOrigin(0,0);
        this.addRow(text);

        this.fakeOS.setDone(mail['id']);

        this.fakeOS.addBackFunction(() => {
            this.fakeOS.launchApp('MailApp');
        });
    }
 }