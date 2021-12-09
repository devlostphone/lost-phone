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
        super(fakeOS, 'arc', date);
    }
}

export default class CalendarApp extends App {

    private days: Array<Day> = new Array<Day>();
    private currentDate: Date;
    private container: Phaser.GameObjects.Container;

    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.scene = fakeOS;
        this.currentDate = new Date();
        this.container = this.scene.add.container();
    }

    public render(): void {
        this.showCalendar();
    }

    public update(delta: any, time: any): void { }

    protected showCalendar() : void {
        let month: number = this.currentDate.getMonth() + 1;
        let year: number = this.currentDate.getFullYear();
        let startDay: number = this.currentDate.getDay();
        let endDay: number = new Date(year, month, 0).getDate();
        let endDayLastMonth: number = new Date(year, month - 1, 0).getDate();

        // Add month and year label
        // TODO: Rewrite this
        this.fakeOS.add.text(32, 128, this.fakeOS.getString("month")[month - 1] + ' ' + year, { fontFamily: 'Arial', fontSize: '64px', color: '#ffffff' });

        // Add day header names
        for (let j: number = 0; j < 7; j++) {
            this.container.add(new Phaser.GameObjects.Text(this.scene, 0, 0, this.fakeOS.getString('daysweek')[j], {
                fontFamily: 'Arial',
                fontSize: 48,
                color: '#fff'
            }).setName('labelDay'));
        }

        // TODO: Fix one day offset
        // Create the numberered days
        for (let w: number = 0; w < 6; w++) {
            for (let i: number = 0; i < 7; i++) {
                let currentDay: number = ((w * 7) + i) + 1;
                if (currentDay < startDay) {
                    let dayNumber: number = endDayLastMonth + (currentDay - startDay + 1);
                    let day = new Day(this.scene, dayNumber);
                    day.bg.setTint(0x3c3c3c);
                    this.container.add(day);
                } else if (currentDay - startDay >= endDay) {
                    let dayNumber: number = (currentDay - startDay + 1) - endDay;
                    let day = new Day(this.scene, dayNumber);
                    day.bg.setTint(0x3c3c3c);
                    this.container.add(day);
                } else {
                    let dayNumber: number = currentDay - startDay + 1;
                    let day = new Day(this.scene, dayNumber);

                    // TODO: Fix month
                    // if (currentDay == this.currentDay &&
                    //     (this.currentMonth + 1) == month &&
                    //     this.currentYear == year)
                    //     day.bg.setTint(0x00ff00);

                    this.container.add(day);
                }
            }
        }

        // Show grid of container elements
        let grid = this.container.getAll();
        Phaser.Actions.GridAlign(grid, {
            width: 7,
            height: 7,
            cellWidth: 92,
            cellHeight: 92,
            position: Phaser.Display.Align.BOTTOM_CENTER,
            x: 72, y: 256
        });

        // this.container.add(new Day(this.scene, "0"));
    }
}