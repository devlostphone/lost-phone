import { start } from "repl";
import { FakeOS } from "../../../scenes/FakeOS";
import { SystemEvents } from "../../events/GameEvents";

/**
 * Picture grid.
 * @todo: review this.
 */
export default class PicGrid extends Phaser.GameObjects.Container
{
    protected media: any;
    protected fakeOS: FakeOS;
    protected textoptions: any;

    /**
     * Class constructor.
     *
     * @param scene
     * @param x
     * @param y
     * @param media
     */
     public constructor(
        scene: FakeOS,
        x: number, y: number,
        media: any
    ){
        super(scene, x, y, []);
        this.media = media;
        this.fakeOS = scene;

        this.textoptions = {
            fontSize: "24px",
            align: "left",
            wordWrap: { width: this.fakeOS.width - 50, useAdvancedWrap: true }
        };

        this.printMedia();
    }

    /**
     * Opens the selected element
     *
     * @param id
     */
    public open(id: string): void {
        let element = this.fakeOS.getActiveApp().getActiveLayer().getByName(id);

        switch (element.constructor) {
            case Phaser.GameObjects.Image:
                this.openImage(element);
                break;
            case Phaser.GameObjects.Container:
                let video = element.getByName(id);
                if (video instanceof Phaser.GameObjects.Video) {
                    this.openVideo(video);
                }
                break;
        }
    }

    /**
     * Prints media collection from the gallery.
     *
     */
    public printMedia(): void {
        for (let i = 0; i < this.media.length; i++) {
            let element: any;

            if (!this.fakeOS.checkDone(this.media[i].condition)) {
                continue;
            }

            switch(this.media[i].type) {
                case 'picture':
                    element = this.printImage(this.media[i]);
                    break;
                case 'video':
                    element = this.printVideo(this.media[i]);
                    break;
                case 'file':
                    element = this.printFile(this.media[i]);
                    break;
            }

            this.add(element);
        }

        let elements = this.getAll();

        this.fakeOS.getActiveApp().addGrid(
            elements,
            {
                columns: 2,
                rows: 4
            });
    }

    /**
     * Prints an image thumbnail in a grid.
     * @param image
     * @returns
     */
    protected printImage(image: any): Phaser.GameObjects.Image {
        let renderArea = this.fakeOS.getUI().getAppRenderSize();
        let element = this.fakeOS.add.image(0, 0, image.id).setName(image.id);
        let panel_size_x = (renderArea.width / 2);
        let panel_size_y = (renderArea.height / 4);

        let scale_x = panel_size_x / element.displayWidth;
        let scale_y = panel_size_y / element.displayHeight;
        let starting_point = 0;
        let rectangle;

        if (scale_x > scale_y) {
            starting_point = (element.displayHeight - (panel_size_y / scale_x)) / 2;
            element.setCrop(
                0,
                starting_point,
                element.displayWidth,
                panel_size_y / scale_x
            );
            rectangle = new Phaser.Geom.Rectangle(
                element.x,
                element.y + starting_point,
                element.displayWidth,
                panel_size_y / scale_x
            );
            element.setScale(scale_x, scale_x);

        } else {
            starting_point = (element.displayWidth - (panel_size_x / scale_y)) / 2;
            element.setCrop(
                starting_point,
                0,
                panel_size_x / scale_y,
                element.displayHeight
            );
            rectangle = new Phaser.Geom.Rectangle(
                element.x + starting_point,
                element.y,
                panel_size_x / scale_y,
                element.displayHeight
            );
            element.setScale(scale_y, scale_y);
        }

        this.fakeOS.addInputEvent(
            'pointerup',
            () => {
                element.setTint(185273);
                setTimeout(() => {
                    element.clearTint();
                    if (image.password !== undefined && !this.fakeOS.checkDone(image.id)) {
                        this.fakeOS.launchEvent(SystemEvents.PasswordProtected, image.id, image.password);
                    } else {
                        this.openImage(element);
                    }
                }, 100);
            },
            element
        );
        element.input.hitArea = rectangle;

        return element;
    }

    /**
     * Prints a video thumbnail in a grid.
     * @param video
     * @returns
     */
    protected printVideo(video: any): Phaser.GameObjects.Container {
        let renderArea = this.fakeOS.getUI().getAppRenderSize();
        let element = this.fakeOS.add.video(0, 0, video.id).setName(video.id);
        let playerButton = this.fakeOS.add.image(0, 0, 'play-button');
        playerButton.displayWidth = renderArea.width / 4;
        playerButton.displayHeight = renderArea.width / 4;
        element.displayWidth = renderArea.width / 2;
        element.displayHeight = renderArea.height / 4;

        this.fakeOS.addInputEvent(
            'pointerup',
            () => {
                element.setTint(185273);
                setTimeout(() => {
                    element.clearTint();

                    if (video.password !== undefined && !this.fakeOS.checkDone(video.id)) {
                        this.fakeOS.launchEvent(SystemEvents.PasswordProtected, video.id, video.password);
                    } else {
                        this.openVideo(element);
                        element.play();
                    }
                }, 100);
            },
            element
        );

        let container = this.fakeOS.add.container(0,0, [element, playerButton]).setName(video.id);
        return container;
    }


    /**
     * Prints a file thumbnail in a grid.
     * @param file
     * @returns
     */
    public printFile(file: any): Phaser.GameObjects.Container {
        let renderArea = this.fakeOS.getUI().getAppRenderSize();
        let rectangle = this.fakeOS.add.rectangle(
            0,0,
            renderArea.width / 2,
            renderArea.height / 4);
        let element = this.fakeOS.add.image(0, 0, 'files').setName(file.id);
        let text = this.fakeOS.add.text(0, 100, file.filename).setOrigin(0.5);
        let container = this.fakeOS.add.container(0,0, [rectangle, element, text]).setName(file.id);


        this.fakeOS.addInputEvent(
            'pointerup',
            () => {
                element.setTint(185273);
                setTimeout(() => {
                    element.clearTint();

                    if (file.password !== undefined && !this.fakeOS.checkDone(file.id)) {
                        this.fakeOS.launchEvent(SystemEvents.PasswordProtected, file.id, file.password);
                    } else {
                        this.openFile(file);
                    }
                }, 100);
            },
            element
        );

        return container;
    }

    /**
     * Opens an image element from the gallery.
     * @param element
     */
    public openImage(element: Phaser.GameObjects.Image): void {
        this.fakeOS.getActiveApp().addLayer();
        const area = this.fakeOS.getUI().getAppRenderSize();

        let zoomedImage = this.fakeOS.add.image(0, 0, element.texture);
        let scale_x = area.width / zoomedImage.displayWidth;
        let scale_y = area.height / zoomedImage.displayHeight;

        if (scale_y > scale_x) {
            zoomedImage.setScale(scale_x, scale_x);
        } else {
            zoomedImage.setScale(scale_y, scale_y);
        }

        zoomedImage.x = (area.width / 2);
        zoomedImage.y = (area.height / 2);

        this.fakeOS.getActiveApp().addElements(zoomedImage);
    }

    /**
     * Opens a video element from the gallery.
     * @param element
     */
     public openVideo(element: Phaser.GameObjects.Video): void {
        this.fakeOS.getActiveApp().addLayer();
        const area = this.fakeOS.getUI().getAppRenderSize();

        let zoomedVideo = this.fakeOS.add.video(0, 0, element.getVideoKey());
        zoomedVideo.displayWidth = area.width;
        zoomedVideo.displayHeight = area.height / 2;

        this.fakeOS.getActiveApp().addRow(zoomedVideo, {y: 4});

        this.fakeOS.addInputEvent(
            'pointerup',
            () => {
                if (element.isPlaying()) {
                    element.setPaused(true);
                } else {
                    element.play();
                }
            },
            element
        );
    }

    /**
     * Opens a file element from the gallery.
     * @param element
     */
    public openFile(element: any): void {
        this.fakeOS.getActiveApp().addLayer();
        const area = this.fakeOS.getUI().getAppRenderSize();

        let text;

        if (element['file']) {
            fetch(element['file'])
                .then((response) => response.text())
                .then((mailText) => {
                    text = this.fakeOS.add.text(0,0,
                        mailText.split("\\n"),
                        this.textoptions
                    ).setOrigin(0,0);
                    this.fakeOS.getActiveApp().addRow(text, {position: Phaser.Display.Align.TOP_CENTER});
                });
        } else {
            text = this.fakeOS.add.text(0,0,
                element['contents'].split("\\n"),
                this.textoptions
            ).setOrigin(0,0)
            this.fakeOS.getActiveApp().addRow(text, {position: Phaser.Display.Align.TOP_CENTER});
        }

    }
}