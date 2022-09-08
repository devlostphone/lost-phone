import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';
import BottomMenu from '../ui/gameObjects/BottomMenu';

/**
 * Phone app.
 */
 export default class PhoneApp extends App {

    protected menu: any;

    /**
     * Class constructor.
     *
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
    }

    /**
     * @inheritdoc
     */
    public render(): void {
        this.menu = new BottomMenu(this.fakeOS,
            0,
            0,
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

        this.addRow(this.menu);
    }

    public showFavorites(): void {
        this.fakeOS.log('Show favourites');
    }

    public showRecent(): void {
        this.fakeOS.log('Show recent calls');
    }

    public showContacts(): void {
        this.fakeOS.log('Show contacts');
    }
}
