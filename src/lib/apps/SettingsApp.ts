import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';
import QRCode from 'qrcode';

/**
 * Settings app
 */
export default class SettingsApp extends App {

    protected qr: any;
    protected qrtext: any;

    /**
     * Class constructor.
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
    }

    /**
     * @inheritdoc
     */
    public render(): void {
        this.showTitle();
        this.showOptions();
    }

    /**
     * Shows app title.
     */
    public showTitle(): void {
        this.addRow(this.fakeOS.add.text(0,0,this.fakeOS.getString('settings')));
        this.addRow(this.fakeOS.add.line(0,0,
            0, 0,
            this.fakeOS.width*0.8, 0,
            0xffffff
        ));
    }

    /**
     * Shows app options.
     */
    public showOptions(): void {
        this.addRow(this.notificationOption());
        this.addRow(this.showResetOption());
        this.addRow(this.showQROption());
    }

    /**
     * Shows "show notifications" option
     * @returns Game elements to display
     */
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

    /**
     * Shows "reset to factory settings " option
     * @returns Game elements to display
     */
    protected showResetOption(): any[] {
        let text = this.fakeOS.add.text(0,0, this.fakeOS.getString('reset-data'));

        this.fakeOS.addInputEvent(
            'pointerup',
            () => {
                this.fakeOS.cleanState();
                this.fakeOS.saveState();
                location.reload();
            },
            text
        );

        return [text];
    }

    /**
     * Shows "show QR" option.
     * @returns Game elements to display
     */
    protected showQROption(): any[] {
        let text = this.fakeOS.add.text(0,0,this.fakeOS.getString('getQR'));
        this.fakeOS.addInputEvent(
            'pointerup',
            () => {
                this.addLayer();
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

    /**
     * Displays a QR with current game state.
     */
    protected showQR(): void {
        let url = this.fakeOS.generateURL(
            this.fakeOS.getURL(),
            this.fakeOS.getState()
        );
        this.qr = this.fakeOS.add.image(0,0,'url');
        this.addRow(this.qr, {y: 4});

        this.qrtext = this.fakeOS.add.text(
            0,0,
            this.fakeOS.getString('copy-to-clipboard')
        );
        this.addRow(this.qrtext);

        this.fakeOS.addInputEvent('pointerup', () => {
            navigator.clipboard.writeText(url);
            this.qrtext.text = this.fakeOS.getString('copied-to-clipboard');
        }, this.qrtext);

        this.fakeOS.textures.off('onload');
    }
}