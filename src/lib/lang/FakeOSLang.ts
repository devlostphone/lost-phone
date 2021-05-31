import { FakeOS } from "scenes/FakeOS";

declare module "scenes/FakeOS" {
    interface FakeOS {
        /**
         * FakeOS language.
        */
        lang: string;

        /**
         * Get a string translation.
         *
         * @param key
         * @param additions
         * @returns     The translated string
         */
        getLang(key: string, additions?: string[]): string;
    }
}

FakeOS.prototype.getLang = function(key: string, additions?: string[]): string {
    let strings = this.cache.json.get('language-'+this.lang);
    return strings[key];
}