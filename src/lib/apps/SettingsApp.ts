import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';
import QRCode from 'qrcode';

/**
 * Settings app
 */
export default class SettingsApp extends App {

    protected qr: any;
    protected qrtext: any;
    protected header?: Phaser.GameObjects.Text;
    
    /**
     * Class constructor.
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.textOptions = {
            fontSize: "48px",
            align: "left",
            color: '#1c1c1c',
            fontFamily: 'Roboto-Bold',
            wordWrap: { width: this.fakeOS.width - 50, useAdvancedWrap: true }
        };
    }

    /**
     * @inheritdoc
     */
    public render(): void {
        this.setBackground();
        this.showTitle();
        this.showOptions();
    }

    /**
     * Shows app title.
     */
    public showTitle(): void {
        this.header = this.fakeOS.add.text(0, 0,
                                          this.fakeOS.getString('settings'),
                                          this.textOptions
                                         ); 
        this.addRow( this.header, {'position': Phaser.Display.Align.TOP_LEFT});
        this.header.setPadding(30,0,0,0);

        let line = this.fakeOS.add.line(0, 0, 30, -30, this.fakeOS.width*0.8, -30, 0x808080);
        this.addRow(line, {'position': Phaser.Display.Align.TOP_LEFT});
    }

    /**
     * Shows app options.
     */
    public showOptions(): void {
        this.addRow(this.notificationOption(), {'position': Phaser.Display.Align.TOP_LEFT});
        this.addRow(this.showResetOption(), {'position': Phaser.Display.Align.TOP_LEFT});
        this.addRow(this.showQROption(), {'position': Phaser.Display.Align.TOP_LEFT});
    }

    /**
     * Shows "show notifications" option
     * @returns Game elements to display
     */
    protected notificationOption(): any[] {

        let text = this.fakeOS.add.text(0,0,this.fakeOS.getString('showNotifications'), this.textOptions);
        text.setFontSize(24);
        text.setPadding(30,0,0,0);

        let notificationSetting = this.fakeOS.getSettings().getSettingValue('notificationPopup');
        let toggle = this.fakeOS.add.text(0,0, notificationSetting ? 'O' :'X', this.textOptions);
        toggle.setFontSize(24);
        toggle.setPadding(18,0,0,0);

        // let line = this.fakeOS.add.line(0, 0, 30, -30, this.fakeOS.width*0.8, -30, 0xc0c0c0);
        
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
        let text = this.fakeOS.add.text(0,0, this.fakeOS.getString('reset-data'), this.textOptions);
        text.setFontSize(24);
        text.setPadding(30,0,0,0);
        
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
        let text = this.fakeOS.add.text(0,0,this.fakeOS.getString('getQR'), this.textOptions);
        text.setFontSize(24);
        text.setPadding(30,0,0,0);

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

    /**
     * Set app background
     */
    protected setBackground(image?: string): void {
        if (image !== undefined) {
            this.fakeOS.UI.setBackground(image);
        } else {
            let background = this.fakeOS.cache.json.get('apps').find(app => app.key == 'SettingsApp').background;
            this.fakeOS.UI.setBackground(background);
        }
    }
}
