import { FakeOS } from "../../scenes/FakeOS";

declare module "../../scenes/FakeOS" {
    interface FakeOS {
        eventListeners: object;
        lastClickTime: number;

        addInputEvent(eventType: string, func: Function, object?: Phaser.GameObjects.GameObject, area?: any, callback?: any): void;
        addEventListener(eventType: string, func: Function, once?: boolean): void;
        removeEventListener(eventType: string): void;
        launchEvent(eventType: string, ...args: any[]): void;
    }
}

/**
 * Adds an input event.
 *
 * @param eventType
 * @param func
 * @param object
 */
FakeOS.prototype.addInputEvent = function(eventType: string, func: Function, object?: Phaser.GameObjects.GameObject, area?: any, callback?: any): void {
    let fakeOS = this;

    if (object !== undefined) {
        if (area !== undefined) {
            object.setInteractive(area, callback);
        } else {
            object.setInteractive();
        }
    }
    this.input.on(eventType, function(...args: any[]) {
        if (args[0].getDistanceY() > 0) {
            return;
        }

        if (object !== undefined) {
            if (args[1] != object && Array.isArray(args[1]) && args[1][0] != object) {
                return;
            }

            fakeOS.log('Launching event ' + eventType + ' on ' + object.constructor.name);
        } else {
            fakeOS.log('Launching event ' + eventType);
        }

        let willLaunch = true;

        if (eventType == 'pointerup' && object !== undefined) {
            const currentTime = Date.now();
            if (fakeOS.lastClickTime === undefined) {
                fakeOS.lastClickTime = 0;
            }
            if (currentTime - fakeOS.lastClickTime > 300) {
                fakeOS.lastClickTime = currentTime;
            } else {
                willLaunch = false;
            }
        }

        if (willLaunch) {
            func(...args);
        }
    });
}

/**
 * Adds a listener to an specific event.
 *
 * @param eventType
 * @param func
 */
FakeOS.prototype.addEventListener = function(eventType: string, func: Function, once: boolean = false): void {
    let fakeOS = this;

    let eventFunc = function(...args: any[]) {
        fakeOS.log('Received ' + eventType + ' event');
        func(...args);
    };

    if (once) {
        fakeOS.game.events.once(eventType, eventFunc);
    } else {
        fakeOS.game.events.on(eventType, eventFunc);
    }
}

/**
 * Removes all listeners to an specific event.
 *
 * @param eventType
 * @param func
 */
FakeOS.prototype.removeEventListener = function(eventType: string): void {
    this.game.events.off(eventType);
}

/**
 * Launches an event.
 *
 * @param eventType
 */
FakeOS.prototype.launchEvent = function(eventType: string, ...args: any[]): void {
    this.log('Launched event ' + eventType);
    this.game.events.emit(eventType, ...args);
}