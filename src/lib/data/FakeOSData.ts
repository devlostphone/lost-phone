import { FakeOS } from "~/scenes/FakeOS";
import { PhoneEvents } from "../events/GameEvents";

declare module "scenes/FakeOS" {
    interface FakeOS {
        setDone(id: string): void;
        checkDone(conditions: any): boolean;
        checkNew(): void;
    }
}

FakeOS.prototype.setDone = function(id: string): void {
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

FakeOS.prototype.checkNew = function(): void {
    let items = [];
    let apps = this.cache.json.get('apps');
    let complete = Object.keys(this.registry.get('complete'));
    let notifications = this.registry.get('notifications');

    for (let app in apps) {
        let type = apps[app]['type'];
        let content = this.cache.json.get(type);

        if (content !== undefined) {
            for (let element in content) {
                // If already completed or already in notifications, skip the element.
                if(complete.includes(content[element]['id']) || notifications.includes(content[element]['id'])) {
                    continue;
                }
                let conditions = content[element]['condition'];
                if (!Array.isArray(conditions)) {
                    conditions = [conditions];
                }

                if(this.checkDone(conditions)) {
                    items.push({
                        id: content[element]['id'],
                        title: content[element]['title']
                    });
                }
            }
        }
    }

    for (let i = 0; i < items.length; i++) {
        this.launchEvent(PhoneEvents.NotificationLaunched, items[i]);
    }

    notifications = [...items, ...notifications];
    this.registry.set('notifications', notifications);
}