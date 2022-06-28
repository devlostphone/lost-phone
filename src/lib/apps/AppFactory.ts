import BrowserApp from './BrowserApp';
import CalendarApp from './CalendarApp';
import ChatApp from './ChatApp';
import ClockApp from './ClockApp';
import FilesApp from './FilesApp';
import GalleryApp from './GalleryApp';
import HomescreenApp from './HomescreenApp';
import LostagramApp from './LostagramApp';
import MailApp from './MailApp';
import PhoneApp from './PhoneApp';
import PodcastApp from './PodcastApp';
import SettingsApp from './SettingsApp';
import StoreApp from './StoreApp';
import ToDoApp from './ToDoApp';
import UnlockScreenApp from './UnlockScreenApp';

/**
 * Contains all app definitions.
 */
const Store: any = {
    BrowserApp,
    CalendarApp,
    ChatApp,
    ClockApp,
    FilesApp,
    GalleryApp,
    HomescreenApp,
    LostagramApp,
    MailApp,
    PhoneApp,
    PodcastApp,
    SettingsApp,
    StoreApp,
    ToDoApp,
    UnlockScreenApp,
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