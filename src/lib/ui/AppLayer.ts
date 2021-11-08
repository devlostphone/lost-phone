import { FakeOS } from '~/scenes/FakeOS';
/**
 * App layer.
 * @todo: review this.
 */
export default class AppLayer extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;

    /**
     * Renderable area (inside UI).
     */
    public area: any;

    /**
     * Number of rows to divide the app into.
     */
    public rows: number = 12;

    /**
     * Row where the last content was placed.
     */
    public last_row: number = 0;

    /**
     * Number of columns to divide the app into.
     */
    public columns: number = 4;

    /**
     * Bottom row number where content was ever placed.
     */
    public bottom_row: number = 0;

    /**
     * Layer background.
     */
    public background: any;

    public onChangeHandler?: Function;

    /**
     * Class constructor.
     *
     * @param scene
     * @param x
     * @param y
     * @param notification
     */
    public constructor(
        scene: FakeOS,
        x: number,
        y: number,
        background: any = undefined,
        options: any = []
    ) {
        super(scene, x, y, []);
        this.fakeOS = scene;
        this.area = this.fakeOS.getUI().getAppRenderSize();
        this.background = this.fakeOS.add.rectangle(
            0,
            0,
            this.area.width,
            this.area.height,
            background ? background : '',
            background ? 1 : 0
        ).setOrigin(0,0).setInteractive().setName('background');
        this.add(this.background);

        if (options['columns'] !== undefined) {
            this.columns = options['columns'];
        }
        if (options['rows'] !== undefined) {
            this.rows = options['rows'];
        }

        if (options['handler'] !== undefined) {
            this.onChangeHandler = options['handler'];
        }

        this.applyMask();
    }

    protected setHandler(handler: Function): void {
        this.onChangeHandler = handler;
    }

    protected launchHandler(): void {
        if (this.onChangeHandler !== undefined) {
            this.fakeOS.log('Launching handler for layer.');
            this.onChangeHandler();
        }
    }

    /**
     * Applies mask so content does not show outside FakeOS borders.
     */
    protected applyMask(): void {
        let graphics = new Phaser.GameObjects.Graphics(this.fakeOS);
        graphics.fillRect(
            0,0,
            this.fakeOS.width,
            this.fakeOS.height
        );
        this.mask = new Phaser.Display.Masks.GeometryMask(
            this.fakeOS,
            graphics
        );

        this.setMask(this.mask);
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

        this.add(elements);

        // Check defaults
        if (options['height'] === undefined) {
            options['height'] = 1;
        }

        if (options['position'] === undefined) {
            options['position'] = Phaser.Display.Align.CENTER;
        }

        let previousY = this.last_row;
        if (options['y'] !== undefined) {
            this.last_row = options['y'];
        }

        Phaser.Actions.GridAlign(elements, {
            x: this.area.width / elements.length / 2,
            y: this.atRow(this.last_row),
            width: -1,
            height: 1,
            cellWidth: this.area.width / elements.length,
            cellHeight: this.rowHeight() * options['height'],
            position: options['position']
        });

        if (options['y'] !== undefined) {
            this.last_row = previousY;
        } else {
            this.last_row += options['height'];
        }

        this.checkBoundaries();
        this.checkAutoScroll(options);
        this.fakeOS.log("Last row is: " + this.last_row);
    }

    /**
     * Arranges content in a grid.
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
        this.add(elements);

        if (options['offsetY'] === undefined) {
            options['offsetY'] = 0;
        }

        if (options['y'] !== undefined) {
            this.last_row = options['y'];
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
            y: this.atRow(this.last_row) + options['offsetY'],
            width: colNumber,
            height: rowNumber,
            cellWidth: this.area.width / colNumber,
            cellHeight: cellHeight,
            position: options['position']
        });

        this.checkBoundaries();
        this.checkAutoScroll(options);
    }

    /**
     * Checks if content is outside boundaries and generates drag area.
     */
    protected checkBoundaries(): void {
        if (this.last_row > this.bottom_row) {
            this.bottom_row = this.last_row;
        }

        // If bottom row is bigger than allowed rows
        if (this.bottom_row > this.rows) {
            this.createDragZone(this.atRow(this.bottom_row));
            if (this.background !== undefined) {
                this.background.height = this.rowHeight() * (this.bottom_row + 1);
            }
        } else if (this.getBounds().height > this.area.height) {
            this.fakeOS.log(
                "Container height (" + this.getBounds().height + ") \
                bigger than printable area (" + this.area.height + ").")
            // If container height is bigger than area height
            this.createDragZone(this.getBounds().bottom);
            if (this.background !== undefined) {
                this.background.height = this.getBounds().height + this.rowHeight();;
            }
        }

    }

    /**
     * Checks if autoscroll is enabled and moves elements accordingly.
     *
     * @param options
     */
    protected checkAutoScroll(options: any): void {
        if (options['autoscroll'] !== undefined && this.last_row > this.rows) {
            this.fakeOS.log("Auto-scrolling");
            let y = - ((this.last_row - this.rows) * this.rowHeight()) - this.rowHeight();

            if (options['autoscroll'] === 'fast') {
                this.y = y;
            } else {
                this.fakeOS.tweens.add({
                    targets: this,
                    y: y,
                    duration: 500
                });
            }
        }
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
     * Sets the app container as interactive and draggable.
     *
     * @param height Height of the container area.
     */
     public createDragZone(height: number): void {
        this.setInteractive(new Phaser.Geom.Rectangle(
            0,0,
            this.area.width,
            height
        ), Phaser.Geom.Rectangle.Contains);
        this.fakeOS.log("Too many elements. Creating drag zone...");
        this.fakeOS.input.setDraggable(this);
        this.fakeOS.input.on(
            'drag',
            (pointer:any, gameobject:any, dragX: any, dragY: any) => {
                if (dragY > 0) {
                    dragY = 0;
                } else if (dragY < -(height - this.area.height)) {
                    dragY = -(height - this.area.height);
                }

                this.y = dragY;
            }
        );

        this.fakeOS.input.on(
            'wheel',
            (pointer:any, gameobject:any, deltaX: any, deltaY: any, deltaZ: any) => {
                this.y -= deltaY

                if (this.y - deltaY > 0) {
                    this.y = 0;
                } else if (this.y - deltaY < -(height - this.area.height)) {
                    this.y = -(height - this.area.height);
                } else {
                    this.y -= deltaY;
                }
            }
        );
    }

    /**
     * Removes layer elements and resets indexes.
     */
    public clear(): void {
        this.remove(this.background);
        this.removeAll(true);
        this.add(this.background);
        this.last_row = 0;
        this.bottom_row = 0;
    }

    /**
     * Destroy layer and all its children.
     * @param fromScene
     */
    public destroy(fromScene: boolean): void {
        this.removeAll(true);
        super.destroy();
    }
}