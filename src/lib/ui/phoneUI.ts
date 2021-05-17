import FakeOS from 'scenes/FakeOS';
import Time from 'lib/ui/gameObjects/Time';

export default class phoneUI {

    scene: FakeOS;

    elements: {
        topBar?: any,
        bottomBar?: any,
        clock?: any,
        homeButton?: any
    };

    constructor(scene: FakeOS) {
        this.scene = scene;
        this.elements = {};
    }

    render() {
        this.scene.log('Loading UI');
        this.createBars();
        this.createButtons();
        this.createClock();
    }

    createBars() {
        this.scene.log('Creating top bar');
        // Display top and bottom bars
        this.elements.topBar = this.scene.add.rectangle(
            0,
            0,
            this.scene.width,
            this.scene.height / 10,
            this.scene.colors.ui.UIBarsColor,
            1.0
        ).setOrigin(0);

        this.scene.log('Creating bottom bar');
        this.elements.bottomBar = this.scene.add.rectangle(
            0,
            this.scene.height - this.scene.height / 10,
            this.scene.width,
            this.scene.height / 10,
            this.scene.colors.ui.UIBarsColor,
          1.0
        ).setOrigin(0);
    }

    createButtons() {
        let t = this;
        this.elements.homeButton = this.scene.add.image(
            this.scene.width / 2,
            this.scene.height - this.scene.height / 10 /2,
            'button-homescreen'
        ).setInteractive()
        .setOrigin(0.5, 0.5)
        .on('pointerup', () => t.scene.launchApp('HomescreenApp'));
    }

    createClock() {
        //  Clock time at the upper bar
        this.scene.log('Creating clock');
        this.elements.clock = new Time(
            this.scene,
            this.scene.width / 2,
            this.scene.height / 10 / 2,
            {
                fontFamily: 'Roboto',
                fontSize : 32,
                color: '#ffffff',
                align: 'center'
            }
        ).setOrigin(0.5, 0.5);
    }

    update(delta:any, time: any) {
        this.elements.clock.update(delta);
    }
}