import { FakeOS } from '~/scenes/FakeOS';

/**
 * Abstract class App.
 * Every FakeOS app needs to extend this class.
 */
export default abstract class App {

    /**
     * FakeOS
     */
    protected fakeOS: FakeOS;

    /**
     * Group of elements of the app.
     */
    public elements: Phaser.GameObjects.Group;

    /**
     * Number of rows to divide the app into.
     */
    public rows: number = 12;

    /**
     * Row where the last content was placed.
     */
    public lastY: number = 0;

    /**
     * Number of columns to divide the app into.
     */
    public columns: number = 4;

    /**
     * UNUSED: Column where the last content was placed.
     */
    public lastX: number = 0;

    /**
     * Biggest row number where content was ever placed.
     */
    public biggestY: number = 0;

    /**
     * A drag zone created when the last row added surpasses
     * the total rows.
     */
    public dragZone?: any;

    /**
     * Class constructor.
     *
     * @param fakeOS FakeOS
     */
    public constructor(fakeOS: FakeOS) {
        this.fakeOS = fakeOS;
        this.elements = new Phaser.GameObjects.Group(fakeOS);
    }

    /**
     * Renders the app. Needs to be overriden.
     */
    public abstract render():void;

    /**
     * Updates render. Will be called on every Scene update.
     * Optionally overriden.
     *
     * @param delta
     * @param time
     */
    public update(delta: any, time: any): void {}

    /**
     * Arranges content in a new row.
     * The elements must already be in the scene.
     *
     * @param elements  A single Phaser GameObject or an array of them
     * @param options   Additional options for rendering the content
     */
    public addRow(elements: any, options:any = {}): void {
        // Accept single elements
        if (!Array.isArray(elements)) {
            elements = [elements];
        }

        this.elements.addMultiple(elements);

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
            x: this.fakeOS.width / elements.length / 2,
            y: this.atRow(this.lastY),
            width: -1,
            height: 1,
            cellWidth: this.fakeOS.width / elements.length,
            cellHeight: this.rowHeight() * options['height'],
            position: options['position']
        });

        if (this.lastY > this.biggestY) {
            this.biggestY = this.lastY;
            if (this.biggestY > this.rows) {
                this.dragZone.input.hitArea.setSize(
                    this.fakeOS.width,
                    this.atRow(this.biggestY+1)
                );
            }
        }

        this.lastY += options['height'];
    }

    /**
     * Arranges content in a grid.
     * The elements must be already in the scene.
     *
     * @param elements  A single Phaser GameObject or an array of them
     * @param options   Additional options for rendering the content
     */
    public addGrid(elements: any, options:any = {}): void {
        // Accept single elements
        if (!Array.isArray(elements)) {
            elements = [elements];
        }

        // The elements are stored in the class so they can be easily
        // cleared when needed.
        this.elements.addMultiple(elements);

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
            x: (this.fakeOS.width / elements.length / 2) +  (this.fakeOS.width / options['columns']) / options['columns'],
            y: this.atRow(this.lastY) + options['offsetY'],
            width: options['columns'],
            height: options['rows'],
            cellWidth: this.fakeOS.width / options['columns'],
            cellHeight: (this.fakeOS.height / options['rows']) * options['height'],
            position: options['position']
        });

        if (this.lastY > this.biggestY) {
            this.biggestY = this.lastY;
            if (this.biggestY > this.rows) {
                this.dragZone.input.hitArea.setSize(
                    this.fakeOS.width,
                    this.atRow(this.biggestY+1)
                );
            }
        }

        this.lastY += Math.floor(elements.length / options['columns'] * options['height']);
    }

    /**
     * Returns the row height.
     *
     * @returns The total height divided by the number of rows
     */
    protected rowHeight(): number {
        return this.fakeOS.height / this.rows;
    }

    /**
     * Returns the y position of the specified row.
     *
     * @param rowNumber The row number
     * @returns         The y position of the specified row
     */
    protected atRow(rowNumber: number): number {
        let area = this.fakeOS.getUI().getAppRenderSize();

        // If rowNumber is negative, start from the bottom
        if (rowNumber < 0) {
          rowNumber = this.rows + rowNumber;
        }
        return area.y + Math.floor((this.rowHeight() * rowNumber) + this.rowHeight()/2);
    }

    public addLayer(): void {
        let area = this.fakeOS.getUI().getAppRenderSize();
        let layer = this.fakeOS.add.rectangle(
            area.x,
            area.y,
            area.width,
            area.height,
            0x333333
        ).setOrigin(0,0);
        this.elements.add(layer);

        // Reset position
        this.lastY = 0;
    }

    /**
     * Clears all the elements stored in the app.
     */
    public destroy(): void {
        this.elements.clear(true, true);
    }
}