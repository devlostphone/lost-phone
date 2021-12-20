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

    public constructor(fakeOS: FakeOS, date: number, labelColor: number = '#ffffff', event: any = {}) {
        super(fakeOS, 'arc', 'small', date);
    }
}

export default class CalendarApp extends App {

    private days: Array<Day> = new Array<Day>();
    private currentDate: Date = new Date();
    private container: any;
    protected fakeOS: FakeOS;

    public constructor(
        scene: FakeOS
    ){
        super(scene);
        this.fakeOS = scene;
        this.currentDate = new Date();
    }

    public render(): void {
        this.showCalendar();
    }

    public update(delta: any, time: any): void { }

    protected showCalendar() : void {
        let year: number = this.currentDate.getFullYear();
        let month: number = this.currentDate.getMonth() + 1;
        let startDay: number = new Date(year, month - 1).getDay();
        let endDay: number = new Date(year, month, 0).getDate();
        let today: number = this.currentDate.getDate();
        let endDayLastMonth: number = new Date(year, month - 1, 0).getDate();
        this.container = this.fakeOS.add.container();

        // Add month and year label
        // TODO: Rewrite this
        let monthYear = this.fakeOS.add.text(32, 128, this.fakeOS.getString("month")[month - 1] + ' ' + year, { fontFamily: 'Arial', fontSize: '64px', color: '#ffffff' });

        // Add day header names
        for (let j: number = 0; j < 7; j++) {
            this.container.add(new Phaser.GameObjects.Text(this.fakeOS, 0, 0, this.fakeOS.getString('daysweek')[j], {
                fontFamily: 'Arial',
                fontSize: 48,
                color: '#fff'
            }).setName('labelDay'));
        }

        // Create the numberered days
        for (let w: number = 0; w < 6; w++) {
            for (let i: number = 0; i < 7; i++) {
                let currentDay: number = ((w * 7) + i) + 1;
                if (currentDay < startDay) {
                    let dayNumber: number = endDayLastMonth + (currentDay - startDay + 1)
                    let day = new Day(this.fakeOS, dayNumber);
                    day.bg.setTint(0x3c3c3c);
                    this.container.add(day);
                } else if (currentDay - startDay >= endDay) {
                    let dayNumber: number = (currentDay - startDay + 1) - endDay;
                    let day = new Day(this.fakeOS, dayNumber);
                    day.bg.setTint(0x3c3c3c);
                    this.container.add(day);
                } else {
                    let day = new Day(this.fakeOS, currentDay - startDay + 1);
                    if (currentDay - startDay + 1 == today) {
                        day.bg.setTint(0x00ff00);
                        day.setInteractive(new Phaser.Geom.Circle(0, 0, 32), Phaser.Geom.Circle.Contains);
                        this.fakeOS.addInputEvent(
                            'pointerup',
                            () => {
                                console.log("what?");
                                this.addLayer();
                            },
                            day
                        );
                    }
                    this.container.add(day);
                }
            }
        }
        Phaser.Actions.GridAlign(this.container.getAll(), {
            width: 7,
            height: 7,
            cellWidth: 92,
            cellHeight: 92,
            position: Phaser.Display.Align.BOTTOM_CENTER,
            x: 72, y: 256
        });

        this.getActiveLayer().add(monthYear);
        this.getActiveLayer().add(this.container.getAll());

    }

    private callbackTest = (day : any) => {
        console.log(day);
    }
}