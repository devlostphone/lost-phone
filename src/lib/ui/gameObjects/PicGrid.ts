import { FakeOS } from "scenes/FakeOS";

/**
 * Picture grid.
 * @todo: review this.
 */
export default class PicGrid extends Phaser.GameObjects.Container
{
    protected media: any;
    protected fakeOS: FakeOS;

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

        this.printMedia();
    }

    /**
     * Prints media collection from the gallery.
     *
     */
    public printMedia(): void {
        let renderArea = this.fakeOS.getUI().getAppRenderSize();
        for (let i = 0; i < this.media.length; i++) {
            let element: any;

            if (this.media[i].type === 'picture') {
                element = this.printImage(this.media[i]);
            } else if (this.media[i].type === 'video') {
                element = this.printVideo(this.media[i]);
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
        let element = this.fakeOS.add.image(0, 0, image.id);
        element.displayWidth = renderArea.width / 2;
        element.displayHeight = renderArea.height / 4;

        this.fakeOS.addInputEvent(
            'pointerup',
            () => {
                element.setTint(185273);
                setTimeout(() => {
                    element.clearTint();
                    this.openImage(element);
                }, 100);
            },
            element
        );

        return element;
    }

    /**
     * Prints a video thumbnail in a grid.
     * @param video
     * @returns
     */
    protected printVideo(video: any): Phaser.GameObjects.Container {
        let renderArea = this.fakeOS.getUI().getAppRenderSize();
        let element = this.fakeOS.add.video(0, 0, video.id);
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
                    this.openVideo(element, container);
                    element.play();
                }, 100);
            },
            element
        );

        let container = this.fakeOS.add.container(0,0, [element, playerButton]);
        return container;
    }

    /**
     * Opens an image element from the gallery.
     * @param element
     */
    public openImage(element: Phaser.GameObjects.Image): void {
        this.fakeOS.getActiveApp().addLayer(0x333333);
        const area = this.fakeOS.getUI().getAppRenderSize();

        let zoomedImage = this.fakeOS.add.image(0, 0, element.texture);
        zoomedImage.displayWidth = area.width;
        zoomedImage.displayHeight = area.height / 2;

        this.fakeOS.getActiveApp().addRow(zoomedImage, {y: 4});
    }

    /**
     * Opens a video element from the gallery.
     * @param element
     */
     public openVideo(element: Phaser.GameObjects.Video, container: Phaser.GameObjects.Container): void {
        this.fakeOS.getActiveApp().addLayer(0x333333);
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
}