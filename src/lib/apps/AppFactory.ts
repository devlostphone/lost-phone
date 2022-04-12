import BrowserApp from '/src/lib/apps/BrowserApp';
import ChatApp from '/src/lib/apps/ChatApp';
import ClockApp from '/src/lib/apps/ClockApp';
import GalleryApp from '/src/lib/apps/GalleryApp';
import HomescreenApp from '/src/lib/apps/HomescreenApp';
import MailApp from '/src/lib/apps/MailApp';
import PodcastApp from '/src/lib/apps/PodcastApp';
import SettingsApp from '/src/lib/apps/SettingsApp';
import UnlockScreenApp from '/src/lib/apps/UnlockScreenApp';
import CalendarApp from '/src/lib/apps/CalendarApp';
import StoreApp from '/src/lib/apps/StoreApp';

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
    StoreApp
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