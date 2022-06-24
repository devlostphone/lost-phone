import { FakeOS } from "../../scenes/FakeOS";

declare module "../../scenes/FakeOS" {
    interface FakeOS {
        cleanState(): void;
        deleteState(): void;
        getState(): any;
        saveState(): void;
        loadState(password?: any): void;
        addData(key:string, data:any): void;
    }
}

/**
 * Resets FakeOS to "factory settings".
 */
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

/**
 * Deletes FakeOS data from local storage.
 */
FakeOS.prototype.deleteState = function(): void {
    localStorage.setItem('lostandphone','');
}

/**
 * Retrieves FakeOS data from local storage.
 */
FakeOS.prototype.getState = function(): any {
    return localStorage.getItem('lostandphone');
}

/**
 * Saves FakeOS data to local storage.
 */
FakeOS.prototype.saveState = function() {
    this.log('Saving state');

    let state = window.btoa(JSON.stringify(this.registry.getAll()));
    localStorage.setItem('lostandphone', state);
}

/**
 * Loads FakeOS data from a given password.
 *
 * @param password
 */
FakeOS.prototype.loadState = function(password?: any) {
    let state;

    if (password === undefined) {
        state = localStorage.getItem('lostandphone');
    } else {
        state = password;
    }

    this.log('Loading state: '+state);

    if (state !== null && state !== '') {
        let values = JSON.parse(window.atob(state));
        for (let key in values) {
            this.registry.set(key, values[key]);
        }
    }

    this.settings.fullSync();
}

/**
 * Adds specific data to FakeOS registry.
 *
 * @param key
 * @param data
 */
FakeOS.prototype.addData = function(key: string, data: any) {
    this.registry.set(key, data);
    this.saveState();
}