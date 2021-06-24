import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';

/**
 * Settings app
 */
export default class SettingsApp extends App {

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
    }

    protected notificationOption(): any[]    {

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
}