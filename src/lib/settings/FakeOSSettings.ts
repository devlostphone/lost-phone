import { FakeOS } from "/src/scenes/FakeOS";
import GameSettings from "./GameSettings";

declare module "scenes/FakeOS" {
    interface FakeOS {
        settings: GameSettings;

        /**
         * Initializes FakeOS settings.
         */
        initSettings(): void;

        /**
         * Returns FakeOS settings.
         */
        getSettings(): GameSettings;
    }
}

FakeOS.prototype.initSettings = function() {
    this.settings = new GameSettings(this);
}

FakeOS.prototype.getSettings = function(): GameSettings {
    return this.settings;
}