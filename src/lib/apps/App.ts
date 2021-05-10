import FakeOS from 'scenes/FakeOS';

export default abstract class App {
    protected scene: FakeOS;

    public rows:number = 12;
    public columns:number = 4;

    public lastX = 0;
    public lastY = 0;
    public biggestY = 0;

    public dragZone?: any;

    constructor(scene: FakeOS) {
        this.scene = scene;
    }

    public abstract render():void;

    addRow(elements: any, options:any = {}) {
        // Accept single elements
        if (!Array.isArray(elements)) {
            elements = [elements];
        }

        // Check defaults
        if (options['height'] === undefined) {
            options['height'] = 1;
        }

        if (options['position'] === undefined) {
            options['position'] = Phaser.Display.Align.CENTER;
        }

        if (options['y'] !== undefined) {
            this.lastY = options['y'];
        }

        Phaser.Actions.GridAlign(elements, {
            x: this.scene.width / elements.length / 2,
            y: this.atRow(this.lastY),
            width: -1,
            height: 1,
            cellWidth: this.scene.width / elements.length,
            cellHeight: this.rowHeight() * options['height'],
            position: options['position']
        });

        if (this.lastY > this.biggestY) {
            this.biggestY = this.lastY;
            if (this.biggestY > this.rows) {
                this.dragZone.input.hitArea.setSize(
                    this.scene.width,
                    this.atRow(this.biggestY+1)
                );
            }
        }

        this.lastY += options['height'];
    }

    addGrid(elements: any, options:any = {}) {
        // Accept single elements
        if (!Array.isArray(elements)) {
            elements = [elements];
        }

        if (options['offsetY'] === undefined) {
            options['offsetY'] = 0;
        }

        if (options['y'] !== undefined) {
            this.lastY = options['y'];
        }

        if (options['height'] === undefined) {
            options['height'] = 1;
        }

        if (options['columns'] === undefined) {
            options['columns'] = this.columns;
        }

        if (options['rows'] === undefined) {
            options['rows'] = this.rows;
        }

        if (options['position'] === undefined) {
            options['position'] = Phaser.Display.Align.CENTER;
        }

        Phaser.Actions.GridAlign(elements, {
            x: (this.scene.width / elements.length / 2) +  (this.scene.width / options['columns']) / options['columns'],
            y: this.atRow(this.lastY) + options['offsetY'],
            width: options['columns'],
            height: options['rows'],
            cellWidth: this.scene.width / options['columns'],
            cellHeight: (this.scene.height / options['rows']) * options['height'],
            position: options['position']
        });

        if (this.lastY > this.biggestY) {
            this.biggestY = this.lastY;
            if (this.biggestY > this.rows) {
                this.dragZone.input.hitArea.setSize(
                    this.scene.width,
                    this.atRow(this.biggestY+1)
                );
            }
        }

        this.lastY += Math.floor(elements.length / options['columns'] * options['height']);
      }

    rowHeight() {
        return this.scene.height / this.rows;
    }

    atRow(rowNumber: number) {
        if (rowNumber < 0) {
          rowNumber = this.rows + rowNumber;
        }
        return this.scene.height / 10 + Math.floor((this.rowHeight() * rowNumber) + this.rowHeight()/2);
    }
}