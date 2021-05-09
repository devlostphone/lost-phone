import LostAndPhone from 'lib/GameLib';

export default class FakeOS extends LostAndPhone.Scene {

    protected lang: string = 'en';

    constructor() {
        super({ key : 'fakeOS'});
    }

    preload() {
        let config = this.cache.json.get('config');

        this.lang = config.language;

    }

    create() {
        this.add.text(
            0,0,
            'TEST'
        );

        this.add.text(
            0,20,
            this.getLang('title')
        );
    }

    getLang(key: string, additions?: string[]) {
        let strings = this.cache.json.get('language-'+this.lang);
        return strings[key];
    }
}