import { FakeOS } from "~/scenes/FakeOS";

declare module "scenes/FakeOS" {
    interface FakeOS {
        cleanState(): void;
        saveState(): void;
        loadState(): void;
    }
}

FakeOS.prototype.cleanState = function() {
    this.log('Cleaning state');
}

FakeOS.prototype.saveState = function() {
    this.log('Saving state');
}

FakeOS.prototype.loadState = function() {
    this.log('Loading state');
}