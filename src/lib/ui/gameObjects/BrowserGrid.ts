import { start } from "repl";
import { FakeOS } from "../../../scenes/FakeOS";
import { SystemEvents } from "../../events/GameEvents";

/**
 * Browser thumbnails grid.
 * @todo: review this.
 */
export default class BrowserGrid extends Phaser.GameObjects.Container
{
    protected tabs: any;
    protected fakeOS: FakeOS;
    protected textOptions: any;

    /**
     * Class constructor.
     *
     * @param scene
     * @param x
     * @param y
     * @param tabs
     */
     public constructor(
        scene: FakeOS,
        x: number, y: number,
        tabs: any
    ){
        super(scene, x, y, []);
        this.tabs = tabs;
        this.fakeOS = scene;
        this.textOptions = { align: "left", fontSize: 24, color: '#fff', fontFamily: 'Roboto', lineSpacing: 5 };
        this.showOpenTabs();
    }

    /**
     * Show open tabs in a thumbnail grid form
     *
     */
    public showOpenTabs(): void {
        for (let i = 0; i < this.tabs.length; i++) {
            let tab: any;

            if (!this.fakeOS.checkDone(this.tabs[i].condition)) {
                continue;
            }

            tab = this.displayTab(this.tabs[i]);

            this.add(tab);
        }

        let thumbnails = this.getAll();
        console.info(thumbnails);

        this.fakeOS.getActiveApp().addGrid(
            thumbnails,
            {
                columns: 2,
                rows: 4,
                paddingX: 16,
                paddingY: 48,
                y: 1
            });
    }

    /**
     * Display a tab thumbnail in a grid.
     * @param tab
     * @returns
     */
    protected displayTab(tab: any): Phaser.GameObjects.Image {
        let renderArea = this.fakeOS.getUI().getAppRenderSize();
        let thumbnail = this.fakeOS.add.image(0, 0, tab.id).setName(tab.id);
        let panel_size_x = (renderArea.width / 2);
        let panel_size_y = (renderArea.height / 4);

        let scale_x = panel_size_x / thumbnail.displayWidth;
        let scale_y = panel_size_y / thumbnail.displayHeight;
        let starting_point = 0;
        let rectangle;

        if (scale_x > scale_y) {
            starting_point = (thumbnail.displayHeight - (panel_size_y / scale_x)) / 2;
            thumbnail.setCrop(
                0,
                starting_point,
                thumbnail.displayWidth,
                panel_size_y / scale_x
            );
            rectangle = new Phaser.Geom.Rectangle(
                thumbnail.x,
                thumbnail.y + starting_point,
                thumbnail.displayWidth,
                panel_size_y / scale_x
            );
            thumbnail.setScale(scale_x, scale_x);

        } else {
            starting_point = (thumbnail.displayWidth - (panel_size_x / scale_y)) / 2;
            thumbnail.setCrop(
                starting_point,
                0,
                panel_size_x / scale_y,
                thumbnail.displayHeight
            );
            rectangle = new Phaser.Geom.Rectangle(
                thumbnail.x + starting_point,
                thumbnail.y,
                panel_size_x / scale_y,
                thumbnail.displayHeight
            );
            thumbnail.setScale(scale_y, scale_y);
        }

        // Add last date visited as text below the tab thumbnail
        // let stamp = this.fakeOS.add.text(0, panel_size_y / 2 + this.textOptions.fontSize, tab.stamp, this.textOptions);
        // thumbnail.addChild(stamp);
                
        this.fakeOS.addInputEvent(
            'pointerup',
            () => {
                thumbnail.setTint(185273);
                setTimeout(() => {
                    thumbnail.clearTint();
                    if (tab.password !== undefined && !this.fakeOS.checkDone(tab.id)) {
                        this.fakeOS.launchEvent(SystemEvents.PasswordProtected, tab.id, tab.password);
                    } else {
                        this.openThumbnail(thumbnail);
                    }
                }, 100);
            },
            thumbnail
        );
        thumbnail.input.hitArea = rectangle;

        return thumbnail;
    }

    /**
     * Opens an image element from the gallery.
     * @param element
     */
    public openThumbnail(element: Phaser.GameObjects.Image): void {
        this.fakeOS.getActiveApp().addLayer('solid-black');
        const area = this.fakeOS.getUI().getAppRenderSize();

        let zoomedImage = this.fakeOS.add.image(0, 0, element.texture);

        // New
        zoomedImage.setOrigin(0);
        zoomedImage.setScale(area.width / zoomedImage.displayWidth, 1);
        // End

        // let scale_x = area.width / zoomedImage.displayWidth;
        // let scale_y = area.height / zoomedImage.displayHeight;

        // if (scale_y > scale_x) {
        //     zoomedImage.setScale(scale_x, scale_x);
        // } else {
        //     zoomedImage.setScale(scale_y, scale_y);
        // }

        // zoomedImage.x = (area.width / 2);
        // zoomedImage.y = (area.height / 2);

        this.fakeOS.getActiveApp().addElements(zoomedImage);
    }
}
