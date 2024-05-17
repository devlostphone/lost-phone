import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';
import AppIcon from '../../lib/ui/gameObjects/AppIcon';
import { PhoneEvents } from '../../lib/events/GameEvents';
import { SystemEvents } from "../../lib/events/GameEvents";

/**
 * Homescreen app.
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
        this.setBackground();
        this.addIconApps();
    }

    /**
     * Set app homescreen default background
     */
    protected setBackground(): void {
        let answer = this.fakeOS.cache.json.get('config').homescreenBackground;
        console.info("Homescreen Background: " + answer);
        this.fakeOS.UI.setBackground(answer);
    }

    /**
     * Adds all the app icons in a grid.
     */
    protected addIconApps(): void {

        let apps = [];
        let favs = [];
        let home = this;
        for (let index in this.fakeOS.apps) {

            if (!this.fakeOS.apps[index].preInstalled && !this.fakeOS.checkDone(this.fakeOS.apps[index]['type'])) {
                continue;
            }

            let app = new AppIcon(
                this.fakeOS,
                this.fakeOS.apps[index],
                0, 0,
                this.fakeOS.apps[index].type
            );

            if (this.fakeOS.apps[index].favourite != true) {
                let icon_text;
                if (typeof this.fakeOS.apps[index]['name'] !== "undefined") {
                    icon_text = this.fakeOS.apps[index]['name'];
                } else {
                    icon_text = this.fakeOS.getString(this.fakeOS.apps[index]['type']);
                }
                app.addLabel(icon_text);
            }

            this.fakeOS.addInputEvent('pointerover', () => {
                app.icon.setAlpha(0.7);
            },
            app.icon);

            this.fakeOS.addInputEvent('pointerout', () => {
                app.icon.setAlpha(1.0);
            },
            app.icon);

            this.fakeOS.addInputEvent('pointerup', () => {
                if (home.fakeOS.apps[index].password !== undefined && !home.fakeOS.checkDone(home.fakeOS.apps[index].key)) {
                    home.fakeOS.log('App requires password');
                    home.fakeOS.launchEvent(
                        SystemEvents.PasswordProtected,
                        home.fakeOS.apps[index].key,
                        home.fakeOS.apps[index].password
                    );
                } else {
                    home.fakeOS.launchApp(home.fakeOS.apps[index].key, app);
                }
            },
            app.icon);

            this.icons[this.fakeOS.apps[index]['type']] = app;

            if (this.fakeOS.apps[index].favourite == true) {
                favs.push(app);
            } else {
                apps.push(app);
            }
        };

        this.addGrid(apps, {
            columns: 4,
            rows: 5 ,
            offsetY: this.fakeOS.getUI().getAppRenderSize().height * 0.05
        });

        this.addGrid(favs, {
            columns: 4,
            rows: 1 ,
            y: 4,
            offsetY: this.fakeOS.getUI().getAppRenderSize().height * 0.05
        });

        this.addBalloons();

        this.fakeOS.addEventListener(
            PhoneEvents.NotificationFinished,
            () => {
                this.addBalloons()
            }
        );
    };

    /**
     * Adds notifications ballons based on current notifications.
     */
    protected addBalloons() {
        let notifications = this.fakeOS.registry.get('notifications');
        let pending = this.fakeOS.getUI().elements.drawer.pendingNotifications;
        notifications = notifications.filter((x:any) => !pending.includes(x));

        for (let index in this.fakeOS.apps) {
            if (!this.fakeOS.apps[index].preInstalled && !this.fakeOS.checkDone(this.fakeOS.apps[index]['type'])) {
                continue;
            }
            let found = notifications.filter((element:any) =>  element['type'] === this.fakeOS.apps[index]['type']).length;
            this.fakeOS.log('Balloon for ' + this.fakeOS.apps[index]['type'] + ' is ' + found);
            this.icons[this.fakeOS.apps[index]['type']].addBalloon(found);
        }
    }

    /**
     * Retrieves an icon by its app name
     *
     * @param appName
     */
    public getIconByAppName(appName: any): any {
        return this.icons[appName];
    }

    /**
     * @inheritdoc
     */
    public goToID(id: string, skipLayerChangeAnim = false): void {
        this.fakeOS.launchApp(id);
    }
}
