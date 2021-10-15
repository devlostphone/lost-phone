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
    public elements: Phaser.GameObjects.Container;

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
     * Renderable area (inside UI).
     */
    public area: any;

    /**
     * Class constructor.
     *
     * @param fakeOS FakeOS
     */
    public constructor(fakeOS: FakeOS) {
        this.fakeOS = fakeOS;
        this.area = this.fakeOS.getUI().getAppRenderSize();
        this.elements = this.fakeOS.add.container(
            this.area.x,
            this.area.y
        );
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
    public update(delta: any, time: any): void {
        /*const friction = 0.99;
        const speedMult = 0.7;

        if (this.dragZone !== undefined) {
            if (this.dragZone.isBeingDragged) {
                this.dragZone.savedPosition = new Phaser.Geom.Point(this.dragZone.x, this.dragZone.y);
            } else {
                // if the moving speed is greater than 1...
                if (this.dragZone.movingSpeed > 1) {
                    // adjusting map y position according to moving speed and angle using trigonometry
                    this.dragZone.y += this.dragZone.movingSpeed * Math.sin(this.dragZone.movingangle);

                    // keep map within boundaries
                    if(this.dragZone.y < this.fakeOS.height - this.dragZone.height){
                        this.dragZone.y = this.fakeOS.height - this.dragZone.height;
                    }
                    // keep map within boundaries
                    if(this.dragZone.y > 0){
                        this.dragZone.y = 0;
                    }
                    // applying friction to moving speed
                    this.dragZone.movingSpeed *= friction;
                    // save current map position
                    this.dragZone.savedPosition = new Phaser.Geom.Point(this.dragZone.x, this.dragZone.y);
                }
                // if the moving speed is less than 1...
                else {
                    // checking distance between current map position and last saved position
                    // which is the position in the previous frame
                    var distance = Phaser.Math.Distance.Between(
                        this.dragZone.savedPosition.x,
                        this.dragZone.savedPosition.y,
                        this.dragZone.x,
                        this.dragZone.y
                    );
                    // same thing with the angle
                    var angle = Phaser.Math.Angle.Between(
                        this.dragZone.savedPosition.x,
                        this.dragZone.savedPosition.y,
                        this.dragZone.x,
                        this.dragZone.y
                    );
                    // if the distance is at least 4 pixels (an arbitrary value to see I am swiping)
                    if(distance > 4) {
                        // set moving speed value
                        this.dragZone.movingSpeed = distance * speedMult;
                        // set moving angle value
                        this.dragZone.movingangle = angle;
                    }
                }
            }
        }*/
    }

    /**
     * Returns app key.
     * @returns Key
     */
    public getKey(): string {
        return this.constructor.name;
    }

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

        this.elements.add(elements);

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
            x: this.area.width / elements.length / 2,
            y: this.atRow(this.lastY),
            width: -1,
            height: 1,
            cellWidth: this.area.width / elements.length,
            cellHeight: this.rowHeight() * options['height'],
            position: options['position']
        });

        this.lastY += options['height'];

        if (this.lastY > this.biggestY) {
            this.biggestY = this.lastY;
            if (this.biggestY > this.rows) {
                this.createDragZone(this.atRow(this.biggestY));
            }
        }
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
        this.elements.add(elements);

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

        const colNumber = options['columns'];
        const rowNumber = elements.length / colNumber;
        const cellHeight = (this.area.height / options['rows']) * options['height'];

        Phaser.Actions.GridAlign(elements, {
            x: (this.area.width / options['columns']) / 2,
            y: this.atRow(this.lastY) + options['offsetY'],
            width: colNumber,
            height: rowNumber,
            cellWidth: this.area.width / colNumber,
            cellHeight: cellHeight,
            position: options['position']
        });

        const totalHeight = cellHeight * rowNumber;

        if (totalHeight > this.area.height) {
            this.createDragZone(totalHeight);
        }
    }

    public createDragZone(height: number): void {
        this.elements.setInteractive(new Phaser.Geom.Rectangle(
            0,0,
            this.area.width,
            height
        ), Phaser.Geom.Rectangle.Contains);
        this.fakeOS.log("Too many elements. Creating drag zone...");
        this.fakeOS.input.setDraggable(this.elements);
        this.fakeOS.input.on(
            'drag',
            (pointer:any, gameobject:any, dragX: any, dragY: any) => {
                if (dragY > this.area.y) {
                    dragY = this.area.y;
                }

                if (dragY < -(height - this.area.height - this.area.y)) {
                    dragY = -(height - this.area.height - this.area.y);
                }

                this.elements.y = dragY
            }
        );
    }

    /**
     * Returns the row height.
     *
     * @returns The total height divided by the number of rows
     */
    protected rowHeight(): number {
        return this.area.height / this.rows;
    }

    /**
     * Returns the y position of the specified row.
     *
     * @param rowNumber The row number
     * @returns         The y position of the specified row
     */
    protected atRow(rowNumber: number): number {
        // If rowNumber is negative, start from the bottom
        if (rowNumber < 0) {
          rowNumber = this.rows + rowNumber;
        }
        return this.area.y * 2 + Math.floor((this.rowHeight() * rowNumber));
    }

    public addLayer(color?: any): Phaser.GameObjects.Rectangle {
        this.fakeOS.input.off('drag');
        this.elements.setInteractive(false);
        this.elements.setX(this.area.x).setY(this.area.y);
        let layer = this.fakeOS.add.rectangle(
            0,
            0,
            this.area.width,
            this.area.height,
            color ? color : '',
            color ? 1 : 0
        ).setOrigin(0,0).setInteractive();
        this.elements.add(layer);

        // Reset position
        this.lastY = 0;

        return layer;
    }

    /**
     * Clears all the elements stored in the app.
     */
    public destroy(): void {
        this.elements.removeAll(true);
        this.elements.destroy();
    }
}