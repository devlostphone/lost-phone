import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';
import QRCode from 'qrcode';

/**
 * Settings app
 */
export default class SettingsApp extends App {

    protected qr: any;
    protected qrtext: any;

    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
    }

    public render(): void {
        this.showTitle();
        this.showOptions();
    }

    public showTitle(): void {
        this.addRow(this.fakeOS.add.text(0,0,this.fakeOS.getString('settings')));
        this.addRow(this.fakeOS.add.line(0,0,
            0, 0,
            this.fakeOS.width*0.8, 0,
            0xffffff
        ));
    }

    public showOptions(): void {
        this.addRow(this.notificationOption());
        this.addRow(this.showQROption());
    }

    protected notificationOption(): any[] {

        let text = this.fakeOS.add.text(0,0,this.fakeOS.getString('showNotifications'));
        let notificationSetting = this.fakeOS.getSettings().getSettingValue('notificationPopup');
        let toggle = this.fakeOS.add.text(0,0, notificationSetting ? 'O' :'X');

        this.fakeOS.addInputEvent(
            'pointerup',
            () => {
                toggle.text = toggle.text === 'X' ? 'O' : 'X';
                this.fakeOS.getSettings().toggleSetting('notificationPopup')
            },
            toggle
        );

        return [text, toggle];
    }

    protected showQROption(): any[] {
        let settingsapp = this;
        let text = this.fakeOS.add.text(0,0,this.fakeOS.getString('getQR'));
        this.fakeOS.addInputEvent(
            'pointerup',
            () => {
                QRCode.toDataURL(this.fakeOS.generateURL(
                    this.fakeOS.getURL(),
                    this.fakeOS.getState()
                ))
                .then(url => {
                    this.fakeOS.log('Generating QR');
                    if (this.qr !== undefined) {
                        this.qr.destroy();
                        this.qrtext.destroy();
                    }
                    if (this.fakeOS.textures.exists('url')) {
                        this.fakeOS.textures.remove('url');
                    }
                    this.fakeOS.textures.addBase64('url', url);
                    this.fakeOS.textures.on('onload', () => this.showQR());
                })
                .catch(err => {
                    console.error(err);
                });
            },
            text
        );

        return [text];
    }

    protected showQR(): void {
        let url = this.fakeOS.generateURL(
            this.fakeOS.getURL(),
            this.fakeOS.getState()
        );
        this.qr = this.fakeOS.add.image(0,0,'url');
        this.addRow(this.qr, {'y': 5});

        this.qrtext = this.fakeOS.add.text(0,0,url,{
            wordWrap: { width: this.fakeOS.width - 50, useAdvancedWrap: true }
        });
        this.addRow(this.qrtext,{'y': 7});

        // TODO: make text selectable as an input
        // TODO: copy URL to clipboard
        /*this.fakeOS.add.dom(0,0)
            .createFromHTML('<input type="text" value="'+url+'" />');*/

        this.fakeOS.textures.off('onload');
    }
}