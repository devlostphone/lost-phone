import { FakeOS } from "~/scenes/FakeOS";

declare module "scenes/FakeOS" {
    interface FakeOS {
        updateURL(value: string): void;
        generateURL(path: string, pass: string): string;
        clearURL(): void;
        getURL(): any;
        getPassword(): any;
    }
}

FakeOS.prototype.updateURL = function(value: string): void {
    this.log('Updating URL');
    const url = window.location.href;
    const passValue = this.getPassword();

    let path = url;
    if (passValue) {
        path = url.replace(passValue[0], "");
    }

    if (value !== undefined) {
        window.history.pushState("", "", this.generateURL(path, value));
    } else {
        window.history.pushState("", "", path);
    }
}

FakeOS.prototype.generateURL = function(path: string, pass: string) {
    return path + '?pass=' + pass;
}

FakeOS.prototype.clearURL = function(): void {
    const url = window.location.href;
    const passValue = this.getPassword();

    let path = url;
    if (passValue) {
        path = url.replace(passValue[0], "");
    }
    window.history.pushState("", "", path);
}

FakeOS.prototype.getURL = function(): any {
    return window.location.href;
}

FakeOS.prototype.getPassword = function(): any {
    const reg = new RegExp( '[?&]pass=([^&#]*)', 'i' );
    const passValue = reg.exec(window.location.href);

    if (passValue === null) {
        return null;
    } else {
        return passValue;
    }
}