import { FakeOS } from "~/scenes/FakeOS";
import GameSettings from "./GameSettings";

declare module "scenes/FakeOS" {
    interface FakeOS {
        settings: GameSettings;
        initSettings(): void;
        getSettings(): GameSettings;
    }
}

FakeOS.prototype.initSettings = function() {
    this.settings = new GameSettings(this);
}

FakeOS.prototype.getSettings = function(): GameSettings {
    return this.settings;
}