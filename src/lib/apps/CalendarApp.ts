import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';
import Button from '../../lib/ui/gameObjects/Button';

/**
 * Calendar app.
 */

export default class CalendarApp extends App {

    protected fakeOS: FakeOS;
    private background: Phaser.GameObjects.Image;
    private objDate: Object;
    private days: Array<Day> = new Array<Day>();
    private currentDate: Date = new Date();
    private monthYearLabel?: Phaser.GameObjects.Text;
    private container: Phaser.GameObjects.Container;
    private backButton?: Phaser.GameObjects.Text;
    private forwardButton?: Phaser.GameObjects.Text;
    private events: any;


    /**
     * Class constructor.
     *
     * @param scene
     */
    public constructor(
        scene: FakeOS
    ){
        super(scene);
        this.fakeOS = scene;
        this.container = this.fakeOS.add.container();

        // Set main date if user not provide costum one at config file
        this.objDate = this.fakeOS.cache.json.get('calendar')['start-date'];
        if (typeof this.objDate == 'object' && Object.keys(this.objDate).length === 0) {
            this.currentDate = new Date();
        } else {
            let day = this.objDate.day;
            let month = this.objDate.month;
            let year = this.objDate.year;
            this.currentDate = new Date(year + '-' + month  + '-' + day);
        }

        this.events = this.fakeOS.cache.json.get('calendar')['events'];
    }

    /**
     * @inheritdoc
     */
    public render(): void {
        this.getActiveLayer().clear();
        this.setBackground();
        this.addGeometry();
        this.switchMonth();
        this.showCalendar();
    }

    /**
     * Switches from one month to the previous/next.
     *
     * @param none
     */
    protected addGeometry(): void {
        // Add grey rectangle background at the top of calendar layout
        this.getActiveLayer().add(
            new Phaser.GameObjects.Rectangle(this.fakeOS,
                                             0, 0,
                                             this.fakeOS.width, 320,
                                             0xefefef
                                            ).setOrigin(0)
        );

        // Add horizontal lines
        let lines_sz: number = 5;
        let start: number = 430;
        let offset: number = 90;
        for (let i: number = 0; i < lines_sz; ++i) {
            this.getActiveLayer().add(
                this.fakeOS.add.line(
                    0, start + (offset * i),
                    0, 0,
                    this.fakeOS.width, 0,
                    0xacacac
                ).setLineWidth(0.25).setOrigin(0));
        }
    }


    /**
     * Switches from one month to the previous/next.
     *
     * @param direction     Direction to change to (back/forward)
     */
    protected switchMonth(direction?: number): void {
        let app = this;

        // TODO: Improve visuals
        // Back and forward month buttons
        this.backButton = this.fakeOS.add.text(
            8, 40,
            '<',
             { fontFamily: 'RobotoCondensed', fontSize: '92px', color: '#f00', align: 'center' }
        ).setInteractive().on('pointerup', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            app.render();
        })

        this.forwardButton = this.fakeOS.add.text(
            this.fakeOS.width - 48, 40,
            '>',
             { fontFamily: 'RobotoCondensed', fontSize: '92px', color: '#f00', align: 'center' }
        ).setInteractive().on('pointerup', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            app.render();
        })

        this.getActiveLayer().add([this.backButton, this.forwardButton]);
    }

    /**
     * Display calendar.
     */
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
                this.fakeOS.width / 2, 92,
                this.fakeOS.getString("month")[month - 1] + ' ' + year,
                { fontFamily: 'RobotoCondensed',
                  fontSize: '72px',
                  color: '#000',
                  align: 'center'
                }).setOrigin(0.5));

        // Add day header names
        for (let j: number = 0; j < 7; j++) {
            this.container.add(new Phaser.GameObjects.Text(this.fakeOS, 0, 0, this.fakeOS.getString('daysweekshort')[j], {
                fontFamily: 'RobotoCondensed',
                fontSize: '24px',
                color: new Date().getHours() >= 9 && new Date().getHours() <= 20 ? '#000' : '#fff'
            }).setName('labelDay'));
        }

        // Create the numberered days
        for (let w: number = 0; w < 6; w++) {
            for (let i: number = 0; i < 7; i++) {
                let currentDay: number = ((w * 7) + i) + 1;
                if (currentDay < startDay) {
                    let dayNumber: number = endDayLastMonth + (currentDay - startDay + 1)
                    this.container.add(new Phaser.GameObjects.Text(this.fakeOS, 0, 0, dayNumber,
                                                                   { color: '#666',
                                                                     fontFamily: 'RobotoCondensed',
                                                                     fontSize: '24px'
                                                                   }));

                } else if (currentDay - startDay >= endDay) {
                    let dayNumber: number = (currentDay - startDay + 1) - endDay;
                    this.container.add(new Phaser.GameObjects.Text(this.fakeOS, 0, 0, dayNumber,
                                                                   { color: '#666',
                                                                     fontFamily: 'RobotoCondensed',
                                                                     fontSize: '24px'
                                                                   }));
                } else {
                    // Add events to calendar
                    let matchEvent: bool = false;
                    for (var index in this.events) {
                        let event = this.events[index];
                        if (event["day"] == (currentDay - startDay + 1) &&
                            event["month"] == month &&
                            event["year"] == year) {

                            matchEvent = true;
                            let container2 = new Phaser.GameObjects.Container(this.fakeOS, 0, 0);
                            container2.add(new Phaser.GameObjects.Ellipse(this.fakeOS, 4, 12, 12, 12, 0x3f3f3f));
                            container2.add(new Phaser.GameObjects.Text(this.fakeOS, -12, -26, currentDay - startDay + 1,
                                                                       { color: '#000',
                                                                         fontFamily: 'RobotoCondensed',
                                                                         fontSize: '24px'
                                                                       }));
                            this.container.add(container2);

                            // Show event details
                            container2.setInteractive(new Phaser.Geom.Circle(0, 0, 32), Phaser.Geom.Circle.Contains).on('pointerup', () => {
                                this.addLayer(0xff0000);
                                this.setBackground();

                                // Simple header text
                                this.getActiveLayer().add(
                                    this.fakeOS.add.text(
                                        this.fakeOS.width / 2, 32,
                                        // @TODO: Need to be localized
                                        "Detalls esdeveniment",
                                        { fontFamily: 'RobotoCondensed',
                                          fontSize: '24px',
                                          color: '#000',
                                          align: "center"
                                        }).setOrigin(0.5, 0.5));
                                // Event title
                                this.getActiveLayer().add(
                                    this.fakeOS.add.text(
                                        12, 64,
                                        event["title"],
                                        { fontFamily: 'RobotoCondensed',
                                          fontSize: '48px',
                                          color: '#000',
                                          align: "left",
                                          wordWrap: { width: this.fakeOS.width }
                                        }));
                                // Display day name, day number month and year
                                // @TODO: Rewrite intl. option
                                let d: Date = new Date(event["year"] + '-' + event["month"] + '-' + event["day"])
                                let weekday = new Intl.DateTimeFormat("ca", { weekday: "long" }).format(d);
                                let month = new Intl.DateTimeFormat("ca", { month: "long" }).format(d);
                                this.getActiveLayer().add(
                                    this.fakeOS.add.text(
                                        12, 128,
                                        weekday + ', ' + event["day"] + ' ' + month + ' de ' + event["year"] + '\nTot el dia',
                                        { fontFamily: 'RobotoCondensed',
                                          fontSize: '24px',
                                          color: '#333',
                                          align: "left",
                                          wordWrap: { width: this.fakeOS.width }
                                        }));
                                // Add horizontal break line
                                this.getActiveLayer().add(
                                    this.fakeOS.add.line(
                                        12, 196,
                                        0, 0,
                                        this.fakeOS.width - 32, 0,
                                        0xacacac
                                    ).setOrigin(0)
                                );

                                // let desc = new BBCodeText(this.fakeOS, 0, 200, event["description"], { fontFamily: 'RobotoCondensed' });
                                // this.getActiveLayer().add(desc);
                                this.getActiveLayer().add(
                                    this.fakeOS.add.rexBBCodeText(
                                        12, 222,
                                        event["description"],
                                        { fontFamily: 'RobotoCondensed',
                                          fontSize: '24px',
                                          color: '#3c3c3c',
                                          align: "left",
                                          lineSpacing: 12,
                                          wrap: { mode : 1, width: this.fakeOS.width - 32}
                                        }));

                            });
                        }
                    }
                    if (currentDay - startDay + 1 == today &&
                        // Paint the numbered current day over a red rounded box
                        this.objDate.month == this.currentDate.getMonth() + 1 &&
                        this.objDate.year == this.currentDate.getFullYear()) {

                        let container2 = new Phaser.GameObjects.Container(this.fakeOS, 0, 0);
                        container2.add(new Phaser.GameObjects.Ellipse(this.fakeOS, 0, -14, 52, 52, 0xff0000));
                        container2.add(new Phaser.GameObjects.Text(this.fakeOS, -12, -26, currentDay - startDay + 1,
                                                                   { color: '#fff',
                                                                     fontFamily: 'RobotoCondensed',
                                                                     fontSize: '24px'
                                                                   }));

                        this.container.add(container2);

                    } else {
                        // Paint the rest of the ordinary days
                        if (!matchEvent) {
                            this.container.add(new Phaser.GameObjects.Text(this.fakeOS, 0, 0, currentDay - startDay + 1,
                                                                           { color: '#000',
                                                                             fontFamily: 'RobotoCondensed',
                                                                             fontSize: '24px'
                                                                           }));
                        }
                    }
                    matchEvent = false;
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

    /**
     * Set background texture defined on app preferences.
     *
     */
    protected setBackground(): void {
        let typeOfBackground = this.fakeOS.cache.json.get('calendar')['background']['type'];
        switch(typeOfBackground) {
            case 'solid': {
                let hours = new Date().getHours();
                if ( hours >= 9 && hours <= 20 ) {
                    this.background = this.fakeOS.add.image(0, 0, 'solid-white-background', 0);
                } else {
                    this.background = this.fakeOS.add.image(0, 0, 'solid-black-background', 0);
                }
                this.background.setOrigin(0, 0);
                this.background.setScale(
                    this.fakeOS.width / this.background.width,
                    this.fakeOS.height / this.background.height
                );
                this.getActiveLayer().add(this.background);
                break;
            }
            default: {
                break;
            }
        }
    }
}
