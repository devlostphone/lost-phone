import { FakeOS } from "../../scenes/FakeOS";
import GameSettings from "./GameSettings";

declare module "../../scenes/FakeOS" {
    interface FakeOS {
        settings: GameSettings;

        initSettings(): void;
        getSettings(): GameSettings;
    }
}

/**
 * Initializes FakeOS settings.
 */
FakeOS.prototype.initSettings = function() {
    this.settings = new GameSettings(this);
}

/**
 * Returns FakeOS settings.
 */
FakeOS.prototype.getSettings = function(): GameSettings {
    return this.settings;
}