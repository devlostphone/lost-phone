import { FakeOS } from '../../scenes/FakeOS';
import App from './App';

/**
 * Phone app.
 */
 export default class ToDoApp extends App {

    /**
     * Class constructor.
     *
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
    }

    /**
     * Renders the app.
     */
    public render(): void {

    }
}
