import { FakeOS } from "../../scenes/FakeOS";

declare module "../../scenes/FakeOS" {
    interface FakeOS {
        lang: string;
        getString(key: string, additions?: string[]): string;
    }
}

/**
 * Get a string translation.
 *
 * @param key
 * @param additions
 * @returns     The translated string
 */
FakeOS.prototype.getString = function(key: string, additions?: string[]): string {
    let strings = this.cache.json.get('lang-' + this.lang);
    return strings !== undefined && key in strings ? strings[key] : '<'+key+'>';
}