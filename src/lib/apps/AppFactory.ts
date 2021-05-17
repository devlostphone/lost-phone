import HomescreenApp from 'lib/apps/HomescreenApp';
import ClockApp from 'lib/apps/ClockApp';

const Store: any = {
    HomescreenApp,
    ClockApp
}

export default class AppFactory {
    static createInstance(key: string, data: any) {

        if (Store[key] === undefined || Store[key] === null) {
            throw new Error("Class type of "+key+" was not found");
        }

        return new Store[key](data);
    }
}