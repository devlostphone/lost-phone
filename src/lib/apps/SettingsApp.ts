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
     * Text style options.
     */
    protected textHeaderStyle: any = {
        fontSize: "48px",
        align: "center",
        color: '#2f2f2f',
        fontFamily: 'Roboto-Bold'
    };

    protected textRegularStyle: any = {
        fontSize: "32px",
        align: "left",
        color: '#2f2f2f',
        fontFamily: 'Roboto-Bold',
        wordWrap: { width: this.fakeOS.width - 50, useAdvancedWrap: true }
    };

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
        this.getActiveLayer().clear();
        this.setBackground();
        this.showContent();
    }

    /**
     * Shows app title.
     */

    public showContent(): void {
        let container : Phaser.GameObjects.Container = this.fakeOS.add.container(0,0);

        /*
         * Show Header
         */
        let header = this.fakeOS.add.text(-this.fakeOS.getActiveApp().area.width / 2 + 122, 32,
                                          this.fakeOS.getString('settings'),
                                          this.textHeaderStyle).setOrigin(0);

        let line = this.fakeOS.add.line(
            0,0,
            0,111,
            this.fakeOS.getActiveApp().area.width,111
        ).setStrokeStyle(100, 0x3f3f3f);

        /*
         * Show Notifications
         */
        let showNotifications = this.fakeOS.add.text(-this.fakeOS.getActiveApp().area.width / 2 + 122, 122,
                                                     this.fakeOS.getString('showNotifications') + ":",
                                                     this.textRegularStyle).setOrigin(0);


        let notificationSetting = this.fakeOS.getSettings().getSettingValue('notificationPopup');
        let toggle = this.fakeOS.add.text(-this.fakeOS.getActiveApp().area.width / 2 + 480, 122,
                                          notificationSetting ? 'SÍ' :'NO',
                                          this.textRegularStyle).setOrigin(0);

        this.fakeOS.addInputEvent(
            'pointerup',
            () => {
                toggle.text = toggle.text === 'SÍ' ? 'NO' : 'SÍ';
                this.fakeOS.getSettings().toggleSetting('notificationPopup')
            },
            toggle
        );

        /*
         * Show Reset Option
         */
        let resetFactory = this.fakeOS.add.text(-this.fakeOS.getActiveApp().area.width / 2 + 122, 182,
                                                this.fakeOS.getString('reset-data'),
                                                this.textRegularStyle).setOrigin(0);
        this.fakeOS.addInputEvent(
            'pointerup',
            () => {
                this.addLayer();
                let warning = this.fakeOS.add.text(0,0,"Atenció!", this.textOptions);
                warning.setFontSize(64);
                this.addRow(warning, {'position': Phaser.Display.Align.CENTER});

                let message = this.fakeOS.add.text(0,0,"Reiniciar el mòbil significa perdre tot el recorregut que heu realitzat fins ara. Esteu segurs que voleu reiniciar el mòbil?", this.textOptions);
                message.setFontSize(24);
                this.addRow(message, {'position': Phaser.Display.Align.CENTER});

                let confirm = this.fakeOS.add.text(0,0,"Sí, vull reiniciar!", this.textOptions);
                confirm.setFontSize(32);
                confirm.setColor('#ff0000');
                this.addRow(confirm, {'position': Phaser.Display.Align.CENTER});

                this.fakeOS.addInputEvent(
                    'pointerup',
                    () => {
                        this.fakeOS.cleanState();
                        this.fakeOS.saveState();
                        location.reload();
                    },
                    confirm
                );
            },
            resetFactory
        );

        /*
         * Show QR
         */

        let showQR = this.fakeOS.add.text(-this.fakeOS.getActiveApp().area.width / 2 + 122, 242,
                                                this.fakeOS.getString('getQR'),
                                          this.textRegularStyle).setOrigin(0);

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
            showQR
        );

        /* End of settings*/
        container.add([header, line, showNotifications, toggle, resetFactory, showQR]);
        this.addRow(container);
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
            this.fakeOS.getString('copy-to-clipboard'),
            this.textRegularStyle
        ).setOrigin(0);
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
            let background = this.fakeOS.cache.json.get('apps').find((app: any) => app.key == 'SettingsApp').background;
            this.fakeOS.UI.setBackground(background);
        }
    }
}
