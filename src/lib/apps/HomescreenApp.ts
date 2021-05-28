import FakeOS from 'scenes/FakeOS';
import App from 'lib/apps/App';
import AppIcon from 'lib/ui/gameObjects/AppIcon';

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
     * @param scene FakeOS
     */
    public constructor(scene: FakeOS) {
        super(scene);
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
        let app = undefined;
        for (let index in this.scene.apps) {
            if (this.scene.debug) {
                app = new AppIcon(
                    this.scene,
                    this.scene.apps[index],
                    0, 0,
                    'lorem-appsum'
                ).addLabel();
            } else {
                app = new AppIcon(
                    this.scene,
                    this.scene.apps[index],
                    0, 0,
                    this.scene.apps[index].key
                ).addLabel();
            };

            this.icons[this.scene.apps[index]['type']] = app;
            apps.push(app);
        };

        this.addGrid(apps, {
            columns: 3,
            rows: 5 ,
            position: Phaser.Display.Align.BOTTOM_CENTER
        });
    };

}