import { FakeOS } from "../../scenes/FakeOS";
import { PhoneEvents } from "../events/GameEvents";
import AppFactory from '../../lib/apps/AppFactory';

declare module "../../scenes/FakeOS" {
    interface FakeOS {
        setDone(id: string): void;
        checkDone(conditions: any): boolean;
        checkNew(): void;
    }
}

/**
 * Sets an activity as done/completed (remove from notifications).
 *
 * @param id Activity ID
 */
FakeOS.prototype.setDone = function(id: string, value: any = undefined): void {
    let save = this.registry.get('complete');

    if (id in save) {
        return;
    }

    save[id] = true;
    this.registry.set('complete', save);

    // Remove notification
    let notifications = this.registry.get('notifications');
    for (let i=0; i<notifications.length; i++) {
        if (notifications[i].id == id) {
            notifications.splice(i, 1);
            break;
        }
    }
    this.registry.set('notifications', notifications);
    this.launchEvent(PhoneEvents.ActivityFinished);
    this.saveState();
}


/**
 * Checks if conditions are done (activities viewed/completed by the user).
 *
 * @param conditions
 */
FakeOS.prototype.checkDone = function(conditions: any): boolean {
    let complete = true;

    if (conditions === null) {
        return complete;
    }

    if (!Array.isArray(conditions)) {
        conditions = [conditions];
    }

    let save = this.registry.get('complete');
    for (let i=0; i<conditions.length; i++) {
        if (!save[conditions[i]]) {
            complete = false;
            break;
        }
    }

    return complete;
}

/**
 * Checks for new notifications based on user action.
 */
FakeOS.prototype.checkNew = function(): void {
    let items: any[] = [];
    let apps = this.cache.json.get('apps');
    let notifications = this.registry.get('notifications');

    for (let app in apps) {

        if (!apps[app]['hasNotifications']) {
            continue;
        }

        let appInstance = AppFactory.createInstance(apps[app]['key'], this);
        items = [...items, ...appInstance.checkNewElements(apps[app]['type'])];
    }

    for (let i = 0; i < items.length; i++) {
        this.launchEvent(PhoneEvents.NotificationLaunched, items[i]);
    }

    notifications = [...items, ...notifications];
    this.registry.set('notifications', notifications);
}