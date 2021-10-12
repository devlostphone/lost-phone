import ClockApp from '~/lib/apps/ClockApp';
import GalleryApp from '~/lib/apps/GalleryApp';
import HomescreenApp from '~/lib/apps/HomescreenApp';
import MailApp from '~/lib/apps/MailApp';
import SettingsApp from '~/lib/apps/SettingsApp';

/**
 * Contains all app definitions.
 */
const Store: any = {
    ClockApp,
    GalleryApp,
    HomescreenApp,
    MailApp,
    SettingsApp
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