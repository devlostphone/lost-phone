import App from 'lib/apps/App';
import Homescreen from 'lib/apps/Homescreen';
import LostAndPhone from 'lib/GameLib';
import UI from 'lib/ui/phoneUI';
import Handler from 'scenes/Handler';

export default class FakeOS extends LostAndPhone.Scene {

    protected UI?: UI;
    protected activeApp?: App;

    public debug: boolean = false;
    public lang: string = 'en';
    public colors?: any ;
    public apps?: any;

    constructor() {
        super({ key : 'fakeOS'});
    }

    preload() {
        super.preload();
        if (this.handlerScene instanceof Handler) {
            this.handlerScene.sceneRunning = 'fakeOS';
        }
        // Setup basic config
        this.lang = this.cache.json.get('config').language;
        this.debug = this.cache.json.get('config').debug == 'dev';
        this.colors = this.cache.json.get('colors');
        this.apps = this.cache.json.get('apps');
    }

    create() {
        this.cameras.main.setRoundPixels(true);
        if (this.handlerScene instanceof Handler) {
            this.handlerScene?.updateResize(this);
        }

        // Render the UI
        this.UI = new UI(this);
        this.UI.render();

        // Render the homescreen
        this.activeApp = new Homescreen(this);
        this.activeApp.render();
    }

    getLang(key: string, additions?: string[]) {
        let strings = this.cache.json.get('language-'+this.lang);
        return strings[key];
    }

    log(message: string) {
        if (this.debug) {
            console.log('[Scene: '+this.scene.key+'] '+message);
        }
    }
}