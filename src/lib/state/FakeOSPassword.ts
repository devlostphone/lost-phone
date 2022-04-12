import { FakeOS } from "../../scenes/FakeOS";

declare module "../../scenes/FakeOS" {
    interface FakeOS {
        /**
         * Updates URL query string with the given password.
         *
         * @param value
         */
        updateURL(value: string): void;

        /**
         * Returns URL with password query string attached.
         *
         * @param path
         * @param pass
         */
        generateURL(path: string, pass: string): string;

        /**
         * Clears query string form URL.
         */
        clearURL(): void;

        /**
         * Returns current URL.
         */
        getURL(): any;

        /**
         * Returns URL password.
         */
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