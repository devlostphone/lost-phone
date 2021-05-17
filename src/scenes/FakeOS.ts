import App from 'lib/apps/App';
import AppFactory from 'lib/apps/AppFactory';
import LostAndPhone from 'lib/GameLib';
import UI from 'lib/ui/phoneUI';
import Handler from 'scenes/Handler';

export default class FakeOS extends LostAndPhone.Scene {

    protected UI?: UI;
    protected activeApp: App;

    public debug: boolean = false;
    public lang: string = 'en';
    public colors?: any ;
    public apps?: any;

    constructor() {
        super({ key : 'fakeOS'});
        this.activeApp = AppFactory.createInstance('HomescreenApp', this);
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

    update(delta: any, time: any) {
        this.UI?.update(delta, time);
        if (typeof this.activeApp.update === 'function') {
            this.activeApp.update(delta, time);
        }
    }

    launchApp(key: string) {
        this.log('Shutting down: ' + this.activeApp.constructor.name);
        this.activeApp.destroy();

        this.log('Launching App: '+key);
        this.activeApp = AppFactory.createInstance(key, this);
        this.activeApp.render();
    }
}