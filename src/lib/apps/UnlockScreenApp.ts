/**
 * Unlock Screen App
 */

import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';

export default class UnlockScreenApp extends App {

    protected fakeOS: FakeOS;
    private message?: Phaser.GameObjects.Text;
    private pin: string;
    private password: string;
    private dots: any;
    private numericPad: any;
    private enterCode: string;

    /**
     * Class constructor.
     * @param fakeOS
     */
    public constructor(
        scene: FakeOS
    ) {
        super(scene);
        this.fakeOS = scene;
        this.dots = this.fakeOS.add.container();
        this.password = this.fakeOS.cache.json.get('unlock-screen').password;
        this.enterCode = "";
        this.pin = "";

        // Hide home button and back button
        this.fakeOS.getUI().hideHomeButton();
    }

    /**
     * @inheritdoc
     */
    public render(): void {
        this.getActiveLayer().clear();
        this.setShaderAsWallpaper();
        this.displayDate();
        this.displayFeedback();
        this.displayDotsPIN();
        this.displayNumericPad();
    }

    /**
     * Shows date of today in-game.
     */
    protected displayDate(): void {
        // Grabbed from CalendarApp
        // @TODO: Refactor?
        let d: Date;
        let objDate = this.fakeOS.cache.json.get('calendar')['start-date'];
        if (typeof objDate == 'object' && Object.keys(objDate).length === 0) {
            d = new Date();
        } else {
            let day = objDate.day;
            console.log(day);
            let month = objDate.month;
            let year = objDate.year;
            d = new Date(year + '-' + month  + '-' + day);
        }
        // @TRICK: https://devhacksandgoodies.wordpress.com/2014/03/11/javascript-dategetday-starting-at-sunday-instead-of-monday/comment-page-1/
        let dayName = this.fakeOS.getString('daysweek')[(d.getDay() || 7) - 1];
        let monthName = this.fakeOS.getString('month')[d.getMonth()];
        this.getActiveLayer().add(this.fakeOS.add.text(
            this.fakeOS.width / 2, 98,
            // @TODO: Handle with locale prepositions?
            dayName + ', ' + ('0' + d.getDate()).slice(-2) + ' de ' + monthName,
            { fontFamily: 'RobotoCondensed', fontSize: '32px', color: '#ffffff', align: 'center' }
        ).setOrigin(0.5, 0.5));
    }

    /**
     * Shows feedback message.
     */
    protected displayFeedback(): void {
        this.message = this.fakeOS.add.text(
            this.fakeOS.width / 2, 174,
            this.fakeOS.getString('enter-passcode'),
            { fontFamily: 'RobotoCondensed', fontSize: '42px', color: '#ffffff', align: 'center' }
        ).setOrigin(0.5, 0.5);
        this.getActiveLayer().add(this.message);
    }

    /**
     * Shows PIN dots.
     */
    protected displayDotsPIN(): void {
        let container = this.fakeOS.add.container();
        let cell_width : number = 128;
        let dots_size : number = 4;
        let dot_rad : number = 14;

        for (let i = 0; i < dots_size; i++) {
            let dot = this.fakeOS.add.circle(0, 0, dot_rad, 0x0);
            dot.setStrokeStyle(6, 0xffffff);
            container.add(dot);
        }

        this.dots = container.getAll();
        Phaser.Actions.GridAlign(this.dots, {
            width: dots_size,
            height: 1,
            cellWidth: cell_width,
            cellHeight: 16,
            position: Phaser.Display.Align.CENTER,
            x: (this.fakeOS.width / 2) - ((cell_width * dots_size) / 2),
            y: 274
        });
        this.getActiveLayer().add(this.dots);
    }

    /**
     * Shows the numeric pad.
     */
    protected displayNumericPad(): void {
        let ellipse_radius : number = 128;
        let digitLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9','-1', '0'];
        let characterLabels = ['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ'];

        this.numericPad = this.fakeOS.add.container();

        // Create buttons
        for (let label of digitLabels) {
            let button = new Phaser.GameObjects.Container(this.fakeOS, 0, 0);
            button.add(new Phaser.GameObjects.Ellipse(this.fakeOS, 0, 0, ellipse_radius, ellipse_radius, 0x3c3c3c, 0.5).setName('bg'));
            button.add(new Phaser.GameObjects.Text(this.fakeOS, 0, -8, label, { color: '#fff', fontFamily: 'RobotoCondensed', fontSize: '64px'}).setOrigin(0.5).setName('value'));
            if (Number(label) > 1) {
                button.add(new Phaser.GameObjects.Text(this.fakeOS, 0, 32, characterLabels[Number(label) - 2], { color: '#fff', fontFamily: 'RobotoCondensed', fontSize: '24px'}).setOrigin(0.5).setName('value'));
            }
            button.setInteractive(new Phaser.Geom.Circle(0, 0, ellipse_radius / 2), Phaser.Geom.Circle.Contains);

            // Define button events
            this.fakeOS.addInputEvent(
                'pointerdown',
                () => {
                    this.checkPIN(button);
                },
                button
            );

            this.fakeOS.addInputEvent(
                'pointerup',
                () => {
                    button.getByName('bg').setFillStyle(0x3c3c3c, 1);
                },
                button
            );

            this.fakeOS.addInputEvent(
                'pointerover',
                () => {
                    button.getByName('bg').setFillStyle(0x3c3c3c, 1);
                },
                button
            );

            this.fakeOS.addInputEvent(
                'pointerout',
                () => {
                    button.getByName('bg').setFillStyle(0x3c3c3c, 0.5);
                },
                button
            );

            // Hide button with negative value
            if (button.getByName('value').text == '-1')
                button.visible = false;

            this.numericPad.add(button);
        }

        let offset: number = 42;
        Phaser.Actions.GridAlign(this.numericPad.getAll(), {
            width: 3,
            height: 4,
            cellWidth: ellipse_radius + offset,
            cellHeight: ellipse_radius + offset,
            position: Phaser.Display.Align.CENTER,
            x: (this.fakeOS.width / 2) - (((ellipse_radius * 3) + (offset * 3)) / 2),
            y: 340
        });
        this.getActiveLayer().add(this.numericPad.getAll());
    }

    /**
     * Checks the input PIN against the correct one.
     * @param button
     */
    protected checkPIN = (button: any) => {
        let bg = button.getByName('bg').setFillStyle('#fff', 0.25);
        // if (button.sublabel)
        //     button.sublabel.setColor('#000');
        // button.bg.setTint(0xffffff);

        let value: string = button.getByName('value').text;
        this.enterCode = this.enterCode + value;
        let lengthCode = this.enterCode.length;
        lengthCode--;

        if (lengthCode < 4) {
            this.dots[lengthCode].setFillStyle(0xffffff);
            if (lengthCode == 3) {
                if (this.enterCode === this.password) {
                    this.fakeOS.setDone('unlocked');
                    this.fakeOS.getUI().showHomeButton();
                    // @TODO: Add transition zoom out
                    this.fakeOS.launchApp('HomescreenApp');
                } else {
                    // Reset everything
                    for (let dot of this.dots) dot.setFillStyle(0x000000);
                    this.enterCode = "";
                    // @TODO: Find an alternative for shaking only the object nor the camera view
                    // src: https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
                    this.fakeOS.cameras.main.shake(250);
                    window.navigator.vibrate(500);
                    if (this.message !== undefined) {
                        this.message.text = this.fakeOS.getString('enter-passcode-failure');
                    }
                }
            }
        }
    }

    /**
     * Set wallpaper texture defined on app preferences.
     *
     */
    protected setShaderAsWallpaper(): void {
        const shader = this.fakeOS.add.shader('Beau ké?', 0, 0, 1242, 2209);
        shader.setOrigin(0);
        shader.setScale(
            this.fakeOS.width / shader.width,
            this.fakeOS.height / shader.height
        );
        this.getActiveLayer().add(shader);
    }
}
