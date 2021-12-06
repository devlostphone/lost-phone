import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';
import Button from '~/lib/ui/gameObjects/Button';

/**
 * Calendar App
 */

export default class CalendarApp extends App {

    public constructor(fakeOS: FakeOS) {
            super(fakeOS);
    }

    public render(): void { }

    public update(delta: any, time: any): void { }
}