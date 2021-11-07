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
    public lastY: number = 0;

    /**
     * Number of columns to divide the app into.
     */
    public columns: number = 4;

    /**
     * Biggest row number where content was ever placed.
     */
    public biggestY: number = 0;

    public background: any;

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
        this.add(this.fakeOS.add.rectangle(
            0,
            0,
            this.area.width,
            this.area.height,
            background ? background : '',
            background ? 1 : 0
        ).setOrigin(0,0).setInteractive().setName('background'));

        if (options['columns'] !== undefined) {
            this.columns = options['columns'];
        }
        if (options['rows'] !== undefined) {
            this.rows = options['rows'];
        }

        this.applyMask();
    }

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

        let previousY = this.lastY;
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

        if (options['y'] !== undefined) {
            this.lastY = previousY;
        } else {
            this.lastY += options['height'];
        }

        if (this.lastY > this.biggestY) {
            this.biggestY = this.lastY;
            if (this.biggestY > this.rows) {
                this.createDragZone(this.atRow(this.biggestY));
                if (this.background !== undefined) {
                    this.background.height = this.rowHeight() * (this.biggestY + 1);
                }
            }
        }

        this.fakeOS.log("Last row is: " + this.lastY);

        if (options['autoscroll'] !== undefined && this.lastY > this.rows) {
            this.fakeOS.log("Auto-scrolling");
            this.fakeOS.tweens.add({
                targets: this,
                y: - (this.lastY - this.rows) * this.rowHeight(),
                duration: 500
            });
        }
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
            if (this.background !== undefined) {
                this.background.height = this.rowHeight() * this.biggestY;
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
                }

                if (dragY < -(height - this.area.height)) {
                    dragY = -(height - this.area.height);
                }

                this.y = dragY
            }
        );

        this.fakeOS.input.on(
            'wheel',
            (pointer:any, gameobject:any, deltaX: any, deltaY: any, deltaZ: any) => {
                this.y -= deltaY

                if (this.y > 0) {
                    this.y = 0;
                }

                if (this.y < -(height - this.area.height)) {
                    this.y = -(height - this.area.height);
                }
            }
        );
    }

    public destroy(fromScene: boolean): void {
        this.removeAll(true);
        super.destroy();
    }
}