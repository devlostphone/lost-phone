import { FakeOS } from '../../scenes/FakeOS';
import AppLayer from '../ui/AppLayer';

/**
 * Abstract class App.
 * Every FakeOS app needs to extend this class.
 */
export default abstract class App {

    /**
     * FakeOS.
     */
    protected fakeOS: FakeOS;

    /**
     * Number of rows to divide the app into.
     */
    public rows: number = 12;

    /**
     * Number of columns to divide the app into.
     */
    public columns: number = 4;

    /**
     * Active layer.
     */
    public activeLayer: number;

    /**
     * App layers.
     */
    public layers: Phaser.GameObjects.Container;

    /**
     * Renderable area (inside UI).
     */
    public area: any;

    /**
     * Changing layer tweens duration (in miliseconds).
     */
    public layerChangeDuration: number = 200;

    /**
     * Whether to skip change layer animation.
     */
    public skipLayerChangeAnim: boolean = false;

    /**
     * Class constructor.
     *
     * @param fakeOS FakeOS
     */
    public constructor(fakeOS: FakeOS, options: any = []) {
        this.fakeOS = fakeOS;
        this.area = this.fakeOS.getUI().getAppRenderSize();
        this.activeLayer = 0;
        this.setOptions(options);

        this.layers = this.fakeOS.add.container(this.area.x, this.area.y);
        this.layers.add(new AppLayer(fakeOS, 0, 0, undefined, options));
        this.getActiveLayer().setHandler(() => {
            this.reRender();
        });
    }

    /**
     * Sets app options.
     *
     * @param options
     */
    public setOptions(options: any) {
        if (options['columns'] !== undefined) {
            this.columns = options['columns'];
        }

        if (options['rows'] !== undefined) {
            this.rows = options['rows'];
        }
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
     * Goes to specific item ID (launched by notification)
     * @param id
     */
    public goToID(id: string, skipLayerChangeAnim = false): void {}

    /**
     * Returns currently viewed ID
     *
     * @returns ID
     */
    public getCurrentID(): string {
        return "";
    }

    /**
     * Returns app key.
     * @returns Key
     */
    public getKey(): string {
        return this.constructor.name;
    }

    /**
     * Returns app type.
     * @returns Type
     */
    public getType(): string {
        return this.getKey().replace('App', '').toLowerCase();
    }

    /**
     * Arranges content in a new row.
     *
     * @param elements  A single Phaser GameObject or an array of them
     * @param options   Additional options for rendering the content
     */
    public addRow(elements: any, options:any = {}): void {
        this.getActiveLayer().addRow(elements, options);
    }

    /**
     * Arranges content in a grid.
     *
     * @param elements  A single Phaser GameObject or an array of them
     * @param options   Additional options for rendering the content
     */
    public addGrid(elements: any, options:any = {}): void {
        this.getActiveLayer().addGrid(elements, options);
    }

    /**
     * Adds a layer on top of the app.
     *
     * @param color  Color of the layer.
     * @returns The layer game object.
     */
    public addLayer(color?: any, backFunction?: Function): void {

        let nextLayer = this.activeLayer + 1;

        this.layers.add(new AppLayer(
            this.fakeOS,
            this.area.width * nextLayer,
            0,
            color,
            {rows: this.rows, columns: this.columns}
        ));

        this.changeLayer(nextLayer);

        this.fakeOS.addBackFunction(() => {
            this.backOneLayer();
        });
    }

    /**
     * Gets layer at specified index.
     *
     * @param index
     * @returns
     */
    public getLayer(index: number): any {
        return this.layers.getAt(index);
    }

    /**
     * Returns active layer.
     *
     * @returns
     */
    public getActiveLayer(): any {
        return this.layers.getAt(this.activeLayer);
    }

    /**
     * Changes active layer to a new one.
     *
     * @param layer
     * @param action
     */
    public changeLayer(layer: number, action?: Function) {
        let oldLayer = this.getLayer(this.activeLayer);
        let newLayer = this.getLayer(layer);
        this.activeLayer = layer;
        this.fakeOS.getUI().fixedElements?.removeAll(true);

        newLayer.moveTo(newLayer.getByName('start-point'), 0);

        newLayer.launchHandler();

        let onComplete = () => {
            oldLayer.bringToTop(oldLayer.getByName('start-point'));
            oldLayer.iterate(function(child: any) {
                child.setActive(false);
            });
            if (action !== undefined) {
                action();
            }
        };

        // Changes behaviour if we skip layer change animation
        if (this.skipLayerChangeAnim) {
            this.layers.x = - this.area.width * this.activeLayer;
            onComplete();
            this.skipLayerChangeAnim = false;
        } else {
            this.fakeOS.tweens.add({
                targets: this.layers,
                x: - this.area.width * this.activeLayer,
                duration: this.layerChangeDuration,
                onComplete: onComplete
            });
        }
    }

    /**
     * Goes back one layer.
     */
    public backOneLayer(): void {
        let layer = this.getActiveLayer();
        this.changeLayer(this.activeLayer - 1, () => layer.destroy(true));
    }

    /**
     * Adds elements to layer (only needed if not using addRow or addGrid).
     *
     * @param elements
     * @returns
     */
    public addElements(elements: any): void {
        return this.getActiveLayer().add(elements);
    }

    /**
     * Returns the row height.
     *
     * @returns The total height divided by the number of rows
     */
    public rowHeight(): number {
        return this.getActiveLayer().rowHeight();
    }

    /**
     * Brings an element to top of the container.
     * @param element Element to bring to top.
     */
    public bringToTop(element: any) {
        this.layers.bringToTop(element);
    }

    /**
     * Retrieves layer last row.
     *
     * @returns
     */
    public getLastRow(): number {
        return this.getActiveLayer().last_row;
    }

    /**
     * Clears current layer.
     */
    public clearCurrentLayer(): void {
        this.getActiveLayer().clear();
    }

    /**
     * Clears current layer and renders the elements again.
     */
    public reRender(): void {
        this.fakeOS.removePhoneEvents();
        this.fakeOS.time.removeAllEvents();
        this.clearCurrentLayer();
        this.render();
        this.fakeOS.getUI().addEventListeners();
    }

    /**
     * Clears all the elements stored in the app.
     */
    public destroy(): void {
        this.layers.removeAll(true);
        this.layers.destroy();
    }

    /**
     * Checks for unlocked elements. Optionally overriden by child class.
     *
     * @param type
     * @returns
     */
    public checkNewElements(type: string): any[] {
        let complete = Object.keys(this.fakeOS.registry.get('complete'));
        let notifications = this.fakeOS.registry.get('notifications');
        let content = this.fakeOS.cache.json.get(type);

        let items = [];

        if (content !== undefined) {
            for (let element in content) {
                // If already completed or already in notifications, skip the element.
                if(complete.includes(content[element]['id']) || notifications.find((o:any) => o.id == content[element]['id'])) {
                    this.fakeOS.log('Skipping notification ' + content[element]['id']);
                    continue;
                }

                let conditions = content[element]['condition'];

                if(this.fakeOS.checkDone(conditions)) {
                    items.push({
                        id: content[element]['id'],
                        title: content[element]['title'],
                        type: type
                    });
                }
            }
        }

        return items;
    }
}