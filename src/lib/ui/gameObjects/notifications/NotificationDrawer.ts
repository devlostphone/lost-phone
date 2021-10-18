import { PhoneEvents } from '~/lib/events/GameEvents';
import { FakeOS } from '~/scenes/FakeOS';
import NotificationList from './NotificationList';
/**
 * Notification Drawer.
 * @todo: review this.
 */
export default class NotificationDrawer extends Phaser.GameObjects.Container
{
    protected fakeOS;
    protected UI;

    public drawerArea?: Phaser.GameObjects.Container;
    public drawerBox?: Phaser.GameObjects.Rectangle;
    public drawerLauncher?: Phaser.GameObjects.Polygon;
    public drawerHide?: Phaser.GameObjects.Polygon;

    public notificationList: NotificationList;
    public pendingNotifications: any[];
    public isNotificationYoyoing: boolean;

    /**
     * Class constructor.
     *
     * @param scene
     * @param x
     * @param y
     */
    public constructor(
        fakeOS: FakeOS,
        x: number,
        y: number
    ) {
        super(fakeOS, x, y, []);
        this.fakeOS = fakeOS;
        this.UI = fakeOS.getUI();

        this.renderDrawerArea();
        this.renderDrawerLauncher();
        this.renderDrawerHide();

        this.notificationList = new NotificationList(
            this.fakeOS,
            0,
            this.UI.elements.topBar.height
        ).setDepth(1001);
        this.drawerArea?.add(this.notificationList);
        this.pendingNotifications = [];
        this.isNotificationYoyoing = false;

        this.fakeOS.addEventListener(
            PhoneEvents.NotificationFinished,
            () => {
                setTimeout(() => {
                    this.isNotificationYoyoing = false;
                }, 1000);
            }
        );

        this.addEvents();
    }

    /**
     * Renders the drawer area.
     */
    protected renderDrawerArea(): void {
        // Create drawer area, off camera
        this.drawerArea = this.fakeOS.add.container(
            0, -this.fakeOS.height
        ).setDepth(100)
        .setSize(this.fakeOS.width, this.fakeOS.height)
        .setDepth(1001);

        this.drawerBox = this.fakeOS.add.rectangle(
            0, 0,
            this.fakeOS.width, this.fakeOS.height,
            0x333333
        ).setOrigin(0,0)
        .setDepth(1001);

        // Stops events from going below the box
        this.drawerBox.setInteractive();

        this.drawerArea.add(this.drawerBox);
        this.drawerArea.add(
            this.fakeOS.add.text(
                this.fakeOS.width / 2,
                this.UI.elements.topBar.height / 2,
                this.fakeOS.getString('notifications')
            ).setOrigin(0.5, 0)
        );

        this.add(this.drawerArea);
    }

    /**
     * Renders the drawer polygon launcher.
     */
    protected renderDrawerLauncher(): void {
        // Create drawer launcher
        this.drawerLauncher = this.fakeOS.add.polygon(
            this.fakeOS.width - 50,
            this.fakeOS.height,
            [
                [0,0],
                [0, this.UI.elements.topBar.height],
                [25, this.UI.elements.topBar.height + 25],
                [50, this.UI.elements.topBar.height],
                [50, 0]
            ],
            0x333333
        ).setOrigin(0,0);

        this.drawerArea?.add(this.drawerLauncher);
    }

    /**
     * Renders the drawer hide button.
     */
    protected renderDrawerHide(): void {
        // Create drawer hide button
        this.drawerHide = this.fakeOS.add.polygon(
            this.fakeOS.width - 50,
            this.fakeOS.height - this.UI.elements.topBar.height - 25,
            [
                [0, this.UI.elements.topBar.height + 25],
                [0, 25],
                [25, 0],
                [50, 25],
                [50, this.UI.elements.topBar.height + 25]
            ],
            0xcccccc
        ).setOrigin(0,0);

        this.drawerArea?.add(this.drawerHide);
    }

    /**
     * Refreshes list of notifications.
     */
    public refreshNotifications(): void {
        this.notificationList.refreshNotifications();
    }

    /**
     * Stores a notification to be launched.
     * @param notification
     */
    public launchNotification(notification: any): void {
        this.pendingNotifications.push(notification);
    }

    public addEvents(): void {
        if (this.drawerLauncher !== undefined) {
            this.fakeOS.addInputEvent(
                'pointerup',
                () => {
                    this.fakeOS.log('Launching drawer');
                    this.UI.isDrawerOpen = true;
                    this.fakeOS.tweens.add({
                        targets: this.drawerArea,
                        y: 0,
                        duration: 700
                    });
                },
                this.drawerLauncher
            );
            this.fakeOS.addInputEvent(
                'pointerover',
                () => {
                    this.drawerLauncher?.setFillStyle(0x666666)
                },
                this.drawerLauncher
            );
            this.fakeOS.addInputEvent(
                'pointerout',
                () => {
                    this.drawerLauncher?.setFillStyle(0x333333)
                },
                this.drawerLauncher
            );
        }

        if (this.drawerHide !== undefined) {
            this.fakeOS.addInputEvent(
                'pointerup',
                () => {
                    this.fakeOS.log('Hiding drawer');
                    this.UI.isDrawerOpen = false;
                    this.fakeOS.tweens.add({
                        targets: this.drawerArea,
                        y: -this.fakeOS.height,
                        duration: 700
                    });
                },
                this.drawerHide
            );
            this.fakeOS.addInputEvent(
                'pointerover',
                () => {
                    this.drawerHide?.setFillStyle(0x999999)
                },
                this.drawerHide
            );
            this.fakeOS.addInputEvent(
                'pointerout',
                () => {
                    this.drawerHide?.setFillStyle(0xcccccc)
                },
                this.drawerHide
            );
        }
    }

    /**
     * Update method.
     *
     * @param delta
     * @returns
     */
    public update(delta: any): void {
        if (this.isNotificationYoyoing) {
            return;
        }
        if (this.pendingNotifications.length > 0) {
            if (this.notificationList.launchNotification(this.pendingNotifications[0])) {
                this.isNotificationYoyoing = true;
                this.pendingNotifications.shift();
            }
        }
    }
}