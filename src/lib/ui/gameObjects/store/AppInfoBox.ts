import { PhoneEvents } from '~/lib/events/GameEvents';
import { FakeOS } from '~/scenes/FakeOS';
import AppIcon from '../AppIcon';
import DownloadButton from './DownloadButton';
/**
 * App information box.
 * @todo: review this.
 */
export default class AppInfoBox extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;
    protected background: Phaser.GameObjects.Rectangle;
    protected icon: AppIcon;
    protected description: Phaser.GameObjects.Text;
    protected downloadButton: DownloadButton;

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
        app: any
    ) {
        super(scene, x, y, []);
        this.fakeOS = scene;

        // Create background
        this.background = this.fakeOS.add.rectangle(
            0, 0,
            this.fakeOS.getActiveApp().area.width,
            this.fakeOS.getActiveApp().rowHeight()
        ).setStrokeStyle(1, 0xffffff);
        this.add(this.background);

        // Create app icon
        this.icon = new AppIcon(
            this.fakeOS,
            app,
            - this.fakeOS.getActiveApp().area.width * 0.15, 0,
            this.fakeOS.debug ? 'lorem-appsum' : app.type
        ).addLabel(this.fakeOS.getString(app['type']));
        this.add(this.icon);

        // Create text
        let status = 'download';

        if (app.preInstalled || this.fakeOS.checkDone(app['type'])) {
            status = 'installed';
        }

        let description = app['description'] ? app['description'] : this.fakeOS.getString('no-description');
        this.description = this.fakeOS.add.text(-100, -60, description, {fontSize: '24px'});
        this.downloadButton = new DownloadButton(this.fakeOS, 0, 0, status);
        this.add(this.description);
        this.add(this.downloadButton);

        this.fakeOS.addInputEvent('pointerup', () => {
            this.fakeOS.log('Downloading app ' + app['type']);
            this.downloadButton.startDownload();
            this.fakeOS.setDone(app['type']);
        }, this.downloadButton);
    }
}