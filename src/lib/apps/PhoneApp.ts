import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';
import BottomMenu from '../ui/gameObjects/BottomMenu';

/**
 * Phone app.
 */
export default class PhoneApp extends App {

    protected menu: any;
    protected phone_info: any;
    protected textOptions: any = { align: "left", fontSize: "32px", fontFamily: 'Roboto', lineSpacing: 5 };

    /**
     * Class constructor.
     *
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.phone_info = this.fakeOS.cache.json.get('phone');
    }

    /**
     * @inheritdoc
     */
    public render(): void {
        this.getActiveLayer().clear();
        this.setBackground();
        this.showRecent();
    }

    public addMenu(): void {
        this.menu = new BottomMenu(this.fakeOS,
            this.fakeOS.getUI().getAppRenderSize().width / 2,
            this.fakeOS.getUI().elements.topBar.height,
            [
                {
                    icon: '',
                    text: 'favorites',
                    launches: this.showFavorites
                },
                {
                    icon: '',
                    text: 'recent',
                    launches: this.showRecent
                },
                {
                    icon: '',
                    text: 'contacts',
                    launches: this.showContacts
                }
            ]
        );
        this.fakeOS.getUI().fixedElements?.add(this.menu);
    }

    public showFavorites(): void {
        this.getActiveLayer().clear();
        this.fakeOS.getUI().fixedElements?.remove(this.menu);
        this.addMenu();
        this.getActiveLayer().createDragZone();
        this.fakeOS.log('Show favourites');

        if (this.phone_info['favourites'].length == 0) {
            let text = this.fakeOS.add.text(0,0,
                                            this.fakeOS.getString('no-favourites'),
                                            this.textOptions
                                           );
            this.addRow([text], {y: 1});
        } else {
            let i;
            for (i=0; i<this.phone_info['favourites'].length; i++) {
                let contact = this.fakeOS.add.text(
                    0,0,
                    this.phone_info['favourites'][i],
                    this.textOptions
                );
                this.addRow([contact]);
            }

            let padding = this.fakeOS.add.rectangle(0,0, 400, 400);
            this.addRow(padding);
        }
    }

    public showRecent(): void {
        this.getActiveLayer().clear();
        this.fakeOS.getUI().fixedElements?.remove(this.menu);
        this.addMenu();
        this.getActiveLayer().createDragZone();
        this.fakeOS.log('Show recent calls');
        let i;
        for (i = 0; i < this.phone_info['recent'].length; i++) {
            let position = -250;
            let icon = this.fakeOS.add.image(position, 20,
                                             'received-call');
            let caller = this.fakeOS.add.text(position + 50,0,
                                              this.phone_info['recent'][i].name,
                                              this.textOptions
                                             );
            let date = this.fakeOS.add.text(position + 200,0,
                                            this.phone_info['recent'][i].date,
                                            this.textOptions
                                           );
            let container = new Phaser.GameObjects.Container(this.fakeOS, 0, 0,
                                                             [icon, caller, date]);

            this.addRow([container]);
        }

        let padding = this.fakeOS.add.rectangle(0,0, 400, 400);
        this.addRow([padding]);

    }

    public showContacts(): void {
        this.getActiveLayer().clear();
        this.fakeOS.getUI().fixedElements?.remove(this.menu);
        this.getActiveLayer().createDragZone();
        this.addMenu();
        this.fakeOS.log('Show contacts');

        if (this.phone_info['contacts'].length == 0) {
            let text = this.fakeOS.add.text(0,0,
                                            this.fakeOS.getString('no-contacts'),
                                            this.textOptions
                                           );
            this.addRow([text], {y: 1});
        } else {
            this.fakeOS.log(this.phone_info['contacts']);

            let i;
            for (i=0; i<this.phone_info['contacts'].length; i++) {
                let contact = this.fakeOS.add.text(
                    0,0,
                    this.phone_info['contacts'][i],
                    this.textOptions
                );
                this.addRow([contact]);
            }

            let padding = this.fakeOS.add.rectangle(0,0, 400, 400);
            this.addRow([padding]);
        }
    }

    /**
     * Set app background
     */
    protected setBackground(image?: string): void {
        if (image !== undefined) {
            this.fakeOS.UI.setBackground(image);
        } else {
            let background = this.fakeOS.cache.json.get('apps').find((app: any) => app.key == 'ClockApp').background;
            this.fakeOS.UI.setBackground(background);
        }
    }
}
