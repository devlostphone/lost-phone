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
     * FakeOS mask
     */
    public mask: Phaser.Display.Masks.GeometryMask;

    /**
     * Number of graphic layers of the app.
     */
    public numLayers: number;

    /**
     * Last layer, if any
     */
    protected layer?: Phaser.GameObjects.Rectangle;

    /**
     * Class constructor.
     *
     * @param fakeOS FakeOS
     */
    public constructor(fakeOS: FakeOS) {
        this.fakeOS = fakeOS;
        this.area = this.fakeOS.getUI().getAppRenderSize();
        this.numLayers = 0;
        this.elements = this.fakeOS.add.container(
            this.area.x,
            this.area.y
        );

        let graphics = new Phaser.GameObjects.Graphics(fakeOS);
        graphics.fillRect(
            0,0,
            this.fakeOS.width,
            this.fakeOS.height
        );
        this.mask = new Phaser.Display.Masks.GeometryMask(
            this.fakeOS,
            graphics
        );

        this.elements.setMask(this.mask);
        this.fakeOS.getUI().container?.setMask(this.mask);

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
                if (this.layer !== undefined) {
                    this.layer.height = this.rowHeight() * (this.biggestY + 1);
                }
            }
        }

        this.fakeOS.log("Last row is: " + this.lastY);

        if (options['autoscroll'] !== undefined && this.lastY > this.rows) {
            this.fakeOS.log("Auto-scrolling");
            this.fakeOS.tweens.add({
                targets: this.elements,
                y: - (this.lastY - this.rows) * this.rowHeight(),
                duration: 500
            });
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
            if (this.layer !== undefined) {
                this.layer.height = this.rowHeight() * this.biggestY;
            }
        }
    }

    /**
     * Sets the app container as interactive and draggable.
     *
     * @param height Height of the container area.
     */
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

        this.fakeOS.input.on(
            'wheel',
            (pointer:any, gameobject:any, deltaX: any, deltaY: any, deltaZ: any) => {

                this.elements.y -= deltaY

                if (this.elements.y > this.area.y) {
                    this.elements.y = this.area.y;
                }

                if (this.elements.y < -(height - this.area.height - this.area.y)) {
                    this.elements.y = -(height - this.area.height - this.area.y);
                }
            }
        );
    }

    /**
     * Returns the row height.
     *
     * @returns The total height divided by the number of rows
     */
    public rowHeight(): number {
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

    /**
     * Adds a layer on top of the app.
     *
     * @param color  Color of the layer.
     * @returns The layer game object.
     */
    public addLayer(color?: any): Phaser.GameObjects.Rectangle {
        this.fakeOS.input.removeAllListeners();
        this.fakeOS.getUI().addListeners();
        this.elements.disableInteractive();
        this.elements.setX(this.area.x).setY(this.area.y);
        this.layer = this.fakeOS.add.rectangle(
            0,
            0,
            this.area.width,
            this.area.height,
            color ? color : '',
            color ? 1 : 0
        ).setOrigin(0,0).setInteractive().setDepth(++this.numLayers);
        this.elements.add(this.layer);

        // Reset position
        this.lastY = 0;
        this.biggestY = 0;

        return this.layer;
    }

    /**
     * Returns the current number of layers.
     * @returns # of layers.
     */
    public getNumLayers(): number {
        return this.numLayers;
    }

    /**
     * Brings an element to top of the container.
     * @param element Element to bring to top.
     */
    public bringToTop(element: any) {
        this.elements.bringToTop(element);
    }

    /**
     * Clears all the elements stored in the app.
     */
    public destroy(): void {
        this.elements.removeAll(true);
        this.elements.destroy();
    }
}