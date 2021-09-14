import { FakeOS } from "~/scenes/FakeOS";

declare module "scenes/FakeOS" {
    interface FakeOS {
        setDone(id: string): void;
        checkDone(conditions: any): boolean;
    }
}

FakeOS.prototype.setDone = function(id: string): void {
    let save = this.registry.get('complete');

    if (id in save) {
        return;
    }

    save[id] = true;
    this.registry.set('complete', save);
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