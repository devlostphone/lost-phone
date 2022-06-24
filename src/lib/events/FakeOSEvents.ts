import { FakeOS } from "../../scenes/FakeOS";

declare module "../../scenes/FakeOS" {
    interface FakeOS {
        eventListeners: object;

        addInputEvent(eventType: string, func: Function, object?: Phaser.GameObjects.GameObject): void;
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
FakeOS.prototype.addInputEvent = function(eventType: string, func: Function, object?: Phaser.GameObjects.GameObject): void {
    let fakeOS = this;

    if (object !== undefined) {
        object.setInteractive();
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

        func(...args);
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