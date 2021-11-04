import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';
import AppIcon from '~/lib/ui/gameObjects/AppIcon';

/**
 * Homescreen app.
 * First app to be called by FakeOS.
 */
export default class HomescreenApp extends App {

    /**
     * Homescreen icons that launch other apps.
     */
    protected icons: any[];

    /**
     * Class constructor.
     *
     * @param fakeOS FakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.icons = [];
    }

    /**
     * Renders the homescreen app.
     */
    public render(): void {
        this.addIconApps();
    }

    /**
     * Adds all the app icons in a grid.
     */
    protected addIconApps(): void {

        let apps = [];
        let home = this;
        for (let index in this.fakeOS.apps) {
            let app = new AppIcon(
                this.fakeOS,
                this.fakeOS.apps[index],
                0, 0,
                this.fakeOS.debug ? 'lorem-appsum' : this.fakeOS.apps[index].key
            ).addLabel(this.fakeOS.getString(this.fakeOS.apps[index]['type']));

            this.fakeOS.addInputEvent('pointerover', () => {
                app.icon.setAlpha(0.7);
            },
            app.icon);

            this.fakeOS.addInputEvent('pointerout', () => {
                app.icon.setAlpha(1.0);
            },
            app.icon);

            this.fakeOS.addInputEvent('pointerup', () => {
                home.fakeOS.launchApp(home.fakeOS.apps[index].key);
            },
            app.icon);

            this.icons[this.fakeOS.apps[index]['type']] = app;
            apps.push(app);
        };

        this.addGrid(apps, {
            columns: 3,
            rows: 5 ,
            offsetY: this.fakeOS.getUI().getAppRenderSize().height * 0.05
        });

        this.addBalloons();
    };

    protected addBalloons()
    {
        let notifications = this.fakeOS.registry.get('notifications');

        for (let index in this.fakeOS.apps) {
            let found = notifications.filter((element:any) =>  element['type'] === this.fakeOS.apps[index]['type']).length;
            this.fakeOS.log('Balloon for ' + this.fakeOS.apps[index]['type'] + ' is ' + found);
            this.icons[this.fakeOS.apps[index]['type']].addBalloon(found);
        }
    }

}