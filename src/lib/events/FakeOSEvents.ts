import { FakeOS } from "~/scenes/FakeOS";

declare module "scenes/FakeOS" {
    interface FakeOS {
        /**
         * Adds an input event.
         *
         * @param eventType
         * @param func
         * @param object
         */
        addInputEvent(eventType: string, func: Function, object: Phaser.GameObjects.GameObject): void;
    }
}

FakeOS.prototype.addInputEvent = function(eventType: string, func: Function, object: Phaser.GameObjects.GameObject): void {
    let fakeOS = this;

    object.setInteractive();
    object.on(eventType, function(this: any, event: any) {
        fakeOS.log('Launching event '+eventType+' on '+object.constructor.name);
        func(this, event);
    });
}