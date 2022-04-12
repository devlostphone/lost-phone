import { PhoneEvents } from '../../lib/events/GameEvents';
import { FakeOS } from '../../scenes/FakeOS';

/**
 * Game settings class.
 */
export default class GameSettings {

    /**
     * FakeOS.
     */
    public fakeOS: FakeOS;

    /**
     * Game settings.
     */
    protected options: any;

    /**
     * Class constructor.
     *
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        this.fakeOS = fakeOS;
        this.options = {
            'muteSound': {
                'gameSetting': 'sound.mute',
                'defaultValue': false
            },
            'notificationPopup': {
                'defaultValue': false
            }
        };

        let settings = this.fakeOS.getGame().registry.get('settings');
        for (let key in this.options) {
            settings[key] = this.options[key]['defaultValue'];
        }
    }

    /**
     * Toggles a game setting.
     *
     * @param key
     */
    public toggleSetting(key: string) {
        this.setSettingValue(key, !this.getSettingValue(key));
    }

    /**
     * Sets a value to a setting.
     *
     * @param key
     * @param value
     */
    public setSettingValue(key: string, value: any) {
        this.fakeOS.log('Changing key ' + key + ' to value ' + value);
        let settings = this.fakeOS.getGame().registry.get('settings');

        if (key in this.options) {
            settings[key] = value;
            this.fakeOS.getGame().registry.set('settings', settings);

            // Update game setting (if any)
            this.setGameConfigValue(key);
            this.fakeOS.getGame().events.emit(PhoneEvents.SettingsUpdated);
            this.fakeOS.saveState();
        }
    }

    /**
     * Changes a Phaser game setting with the stored value.
     *
     * @param key
     */
    public setGameConfigValue(key: string) {
        let settings = this.fakeOS.getGame().registry.get('settings');

        if (this.options[key]['gameSetting'] !== undefined) {
            setPropertyInPath(
                this.options[key]['gameSetting'],
                this.fakeOS.getGame(),
                settings[key]
            );
        }
    }

    /**
     * Get a setting value
     * @param key
     */
    public getSettingValue(key: string) {
        let settings = this.fakeOS.getGame().registry.get('settings');

        if (key in this.options) {
            return settings[key];
        }

        return undefined;
    }

    /**
     * Syncs all PhaserGame settings.
     */
    public fullSync() {
        for (let key in this.options) {
            this.setGameConfigValue(key);
        }
    }
}