import BrowserApp from './BrowserApp';
import ChatApp from './ChatApp';
import ClockApp from './ClockApp';
import GalleryApp from './GalleryApp';
import HomescreenApp from './HomescreenApp';
import MailApp from './MailApp';
import PodcastApp from './PodcastApp';
import SettingsApp from './SettingsApp';
import UnlockScreenApp from './UnlockScreenApp';
import CalendarApp from './CalendarApp';
import StoreApp from './StoreApp';
import PhoneApp from './PhoneApp';

/**
 * Contains all app definitions.
 */
const Store: any = {
    BrowserApp,
    ChatApp,
    ClockApp,
    GalleryApp,
    HomescreenApp,
    MailApp,
    PodcastApp,
    SettingsApp,
    CalendarApp,
    UnlockScreenApp,
    StoreApp,
    PhoneApp
}

/**
 * Class used by FakeOS to retrieve apps based on their key.
 */
export default class AppFactory {

    /**
     * Creates an instance of the app specified by a key.
     *
     * @param key   The name of the app.
     * @param data  Any additional parameters to pass on to the class.
     * @returns     An instance of the specified app.
     */
    public static createInstance(key: string, data: any): any {

        if (Store[key] === undefined || Store[key] === null) {
            throw new Error("Class type of "+key+" was not found.");
        }

        return new Store[key](data);
    }
}