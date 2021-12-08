import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';
import Button from '~/lib/ui/gameObjects/Button';

/**
 * Calendar App
 */

class Day extends Button {
    public date : Date;
    public labelColor : number;
    public event : any;

    public constructor(fakeOS: FakeOS, date: number, event: any = {}, labelColor: number = '#ffffff') {
        super(fakeOS, 'rect', date);
    }
}

export default class CalendarApp extends App {

    private days: Array<Day> = new Array<Day>();
    private container: Phaser.GameObjects.Container;

    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.scene = fakeOS;
        this.container = this.scene.add.container();
    }

    public render(): void {
        this.showCalendar();
    }

    public update(delta: any, time: any): void { }

    protected showCalendar() : void {
        this.container.add(new Day(this.scene, "0"));
    }
}