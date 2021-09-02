import { FakeOS } from "~/scenes/FakeOS";

declare module "scenes/FakeOS" {
    interface FakeOS {
        updateURL(): void;
        getPassword(): string;
    }
}

FakeOS.prototype.updateURL = function() {
    this.log('Updating URL');
}

FakeOS.prototype.getPassword = function(): string {
    this.log('Saving state');
    return "";
}