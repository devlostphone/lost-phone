import App from 'lib/apps/App';
import AppIcon from 'lib/ui/gameObjects/AppIcon';
import FakeOS from 'scenes/FakeOS';

export default class HomescreenApp extends App {

    protected icons: any[];

    constructor(scene: FakeOS) {
        super(scene);
        this.icons = [];
    }

    public render() {
        this.addIconApps();
    }

    protected addIconApps()
    {
        // Files de quatre icones
        // ubica les icones de les apps a tres columenes.
        let apps = [];
        let app = undefined;
        for (let index in this.scene.apps) {
            if (this.scene.debug) {
                app = new AppIcon(
                    this.scene,
                    this.scene.apps[index],
                    0, 0,
                    'lorem-appsum'
                ).addLabel(this.scene.apps[index].name);
            } else {
                app = new AppIcon(
                    this.scene,
                    this.scene.apps[index],
                    0, 0,
                    this.scene.apps[index].key
                ).addLabel(this.scene.apps[index].name);
            };

            this.icons[this.scene.apps[index]['type']] = app;
            apps.push(app);
        };

        this.addGrid(apps, { columns:3, rows: 5 , position: Phaser.Display.Align.BOTTOM_CENTER});
    };

}