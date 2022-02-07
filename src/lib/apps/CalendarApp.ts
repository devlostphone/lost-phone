import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';
import Button from '~/lib/ui/gameObjects/Button';

/**
 * Calendar App
 */

class Day extends Button {
    public date? : Date;
    public labelColor? : number;
    public event : any;

    public constructor(fakeOS: FakeOS, date: number, labelColor: string = '#ffffff', event: any = {}) {
        super(fakeOS, 'arc', 'small', date.toString());
    }
}

export default class CalendarApp extends App {

    protected fakeOS: FakeOS;
    private days: Array<Day> = new Array<Day>();
    private currentDate: Date = new Date();
    private monthYearLabel?: Phaser.GameObjects.Text;
    private container: Phaser.GameObjects.Container;
    private backButton?: Phaser.GameObjects.Text;
    private forwardButton?: Phaser.GameObjects.Text;
    private events: any;


    public constructor(
        scene: FakeOS
    ){
        super(scene);
        this.fakeOS = scene;
        this.currentDate = new Date();
        this.container = this.fakeOS.add.container();
        this.events = this.fakeOS.cache.json.get('calendar');
    }

    public render(): void {
        // Clear layer
        this.getActiveLayer().clear();
        this.switchMonth();
        this.showCalendar();
    }

    public update(delta: any, time: any): void { }

    protected switchMonth(direction?: number): void {
        let app = this;

        // TODO: Improve visuals
        // Back and forward month buttons
        this.backButton = this.fakeOS.add.text(
            0, 72,
            '<',
             { fontFamily: 'Arial', fontSize: '72px', color: '#f00', align: 'center' }
        ).setInteractive().on('pointerup', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            app.render();
        })

        this.forwardButton = this.fakeOS.add.text(
            this.fakeOS.width - 72, 72,
            '>',
             { fontFamily: 'Arial', fontSize: '72px', color: '#f00', align: 'center' }
        ).setInteractive().on('pointerup', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            app.render();
        })

        this.getActiveLayer().add([this.backButton, this.forwardButton]);
    }

    protected showCalendar() : void {
        let year: number = this.currentDate.getFullYear();
        let month: number = this.currentDate.getMonth() + 1;
        let startDay: number = new Date(year, month - 1).getDay();
        let endDay: number = new Date(year, month, 0).getDate();
        let today: number = this.currentDate.getDate();
        let endDayLastMonth: number = new Date(year, month - 1, 0).getDate();

        // Add month and year label
        this.getActiveLayer().add(
            this.fakeOS.add.text(
                32, 128,
                this.fakeOS.getString("month")[month - 1] + ' ' + year,
                { fontFamily: 'Arial',
                  fontSize: '64px',
                  color: '#ffffff'
                }));

        // Add day header names
        for (let j: number = 0; j < 7; j++) {
            this.container.add(new Phaser.GameObjects.Text(this.fakeOS, 0, 0, this.fakeOS.getString('daysweek')[j], {
                fontFamily: 'Arial',
                fontSize: '48px',
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
                    day.bg?.setTint(0x3c3c3c);
                    this.container.add(day);
                } else if (currentDay - startDay >= endDay) {
                    let dayNumber: number = (currentDay - startDay + 1) - endDay;
                    let day = new Day(this.fakeOS, dayNumber);
                    day.bg?.setTint(0x3c3c3c);
                    this.container.add(day);
                } else {
                    let day = new Day(this.fakeOS, currentDay - startDay + 1);
                    // Add events to calendar
                    for (var index in this.events) {
                        let event = this.events[index];
                        if (event["day"] == (currentDay - startDay + 1) &&
                            event["month"] == month &&
                            event["year"] == year) {
                            // TODO: Set human color names at config
                            day.bg?.setTint(0x00ff00);
                            day.setInteractive(new Phaser.Geom.Circle(0, 0, 32), Phaser.Geom.Circle.Contains);
                            this.fakeOS.addInputEvent(
                                'pointerup',
                                () => {
                                    // TODO: Remove in the new layer the navigation buttons
                                    this.addLayer(0x333333);
                                    let calendarEventTitle = this.fakeOS.add.text(0, 0, event["title"]).setOrigin(0, 0);
                                    let calendarEventDescription = this.fakeOS.add.text(0, 0, event["description"]).setOrigin(0, 0);
                                    this.addRow(calendarEventTitle);
                                    this.addRow(calendarEventDescription);
                                }, day);
                        }
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

        this.getActiveLayer().add(this.container.getAll());
    }

    // TODO: Remove this if this doesn't mean anything
    private callbackTest = (day : any) => {
        console.log(day);
    }
}