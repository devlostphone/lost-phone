import { FakeOS } from "~/scenes/FakeOS";

declare module "scenes/FakeOS" {
    interface FakeOS {

        /**
         * Resets FakeOS to "factory settings".
         */
        cleanState(): void;

        /**
         * Deletes FakeOS data from local storage.
         */
        deleteState(): void;

        /**
         * Retrieves FakeOS data from local storage.
         */
        getState(): any;

        /**
         * Saves FakeOS data to local storage.
         */
        saveState(): void;

        /**
         * Loads FakeOS data from a given password.
         *
         * @param password
         */
        loadState(password?: any): void;

        /**
         * Adds specific data to FakeOS registry.
         *
         * @param key
         * @param data
         */
        addData(key:string, data:any): void;
    }
}

FakeOS.prototype.cleanState = function() {
    this.log('Cleaning state');
    this.registry.reset();
    this.registry.set('complete',{});
    this.registry.set('chat', {});
    this.registry.set('notifications',[]);
    this.registry.set('pendingNotifications',[]);
    this.registry.set('settings',{});

    this.initSettings();
}

FakeOS.prototype.deleteState = function(): void {
    localStorage.setItem('lostandphone','');
}

FakeOS.prototype.getState = function(): any {
    return localStorage.getItem('lostandphone');
}

FakeOS.prototype.saveState = function() {
    this.log('Saving state');

    let state = btoa(JSON.stringify(this.registry.getAll()));
    localStorage.setItem('lostandphone', state);
}

FakeOS.prototype.loadState = function(password?: any) {
    let state;

    if (password === undefined) {
        state = localStorage.getItem('lostandphone');
    } else {
        state = password;
    }

    this.log('Loading state: '+state);

    if (state !== null && state !== '') {
        let values = JSON.parse(atob(state));
        for (let key in values) {
            this.registry.set(key, values[key]);
        }
    }

    this.settings.fullSync();
}

FakeOS.prototype.addData = function(key: string, data: any) {
    this.registry.set(key, data);
    this.saveState();
}