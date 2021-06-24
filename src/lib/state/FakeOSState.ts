import { FakeOS } from "~/scenes/FakeOS";

declare module "scenes/FakeOS" {
    interface FakeOS {
        cleanState(): void;
        saveState(): void;
        loadState(password?: any): void;
    }
}

FakeOS.prototype.cleanState = function() {
    this.log('Cleaning state');
    this.registry.reset();
    this.registry.set('complete',{});
    this.registry.set('notifications',[]);
    this.registry.set('pendingNotifications',[]);
    this.registry.set('settings',{});

    this.initSettings();

    localStorage.setItem('lostandphone','');
}

FakeOS.prototype.saveState = function() {
    this.log('Saving state');

    let state = btoa(JSON.stringify(this.registry.getAll()));
    localStorage.setItem('lostandphone', state);
    this.updateURL(state);
}

FakeOS.prototype.loadState = function(password?: any) {
    let state;

    if (password === undefined) {
        state = localStorage.getItem('lostandphone');
    } else {
        state = password;
    }

    this.log('Loading state: '+state);

    if (state !== null) {
        let values = JSON.parse(atob(state));
        for (let key in values) {
            this.registry.set(key, values[key]);
        }
    }

    this.updateURL(state);
    this.settings.fullSync();
}