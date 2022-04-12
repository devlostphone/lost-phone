import { PhoneEvents } from '../../../../lib/events/GameEvents';
import { FakeOS } from '../../../../scenes/FakeOS';
import phoneUI from '../../phoneUI';
import NotificationList from './NotificationList';
/**
 * Notification Drawer.
 * @todo: review this.
 */
export default class NotificationDrawer extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;
    protected UI: phoneUI;
    protected graphicMask?: Phaser.GameObjects.Graphics;

    public drawerArea?: Phaser.GameObjects.Container;
    public drawerBox?: Phaser.GameObjects.Rectangle;
    public drawerLauncher?: Phaser.GameObjects.Polygon;
    public drawerHide?: Phaser.GameObjects.Polygon;

    public notificationList?: NotificationList;
    public pendingNotifications: any[];
    public isNotificationYoyoing: boolean;

    public hasDragZone: boolean;

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
        this.hasDragZone = false;

        this.renderDrawerArea();
        this.renderDrawerLauncher();
        this.renderDrawerHide();
        this.renderNotificationList();

        this.pendingNotifications = [];
        this.isNotificationYoyoing = false;

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
                this.fakeOS.getString('notifications'),
                { fontSize: '24px'}
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
     * Renders the notification list.
     */
    protected renderNotificationList(): void {
        this.notificationList = new NotificationList(
            this.fakeOS,
            0,
            this.UI.elements.topBar.height
        ).setDepth(1001);
        this.drawerArea?.add(this.notificationList);
        this.drawerArea?.moveDown(this.notificationList);

        this.applyMask();
    }

    /**
     * Applies a mask to the notification list.
     */
    protected applyMask(): void {
        if (this.drawerArea == undefined || this.drawerHide == undefined || this.notificationList == undefined) {
            return;
        }
        this.graphicMask = new Phaser.GameObjects.Graphics(this.fakeOS);
        this.graphicMask.fillRect(
            0,
            this.drawerArea.y + this.UI.elements.topBar.height,
            this.fakeOS.width,
            this.fakeOS.height - this.drawerHide.height - this.UI.elements.topBar.height - 20
        );

        this.notificationList?.setMask(new Phaser.Display.Masks.GeometryMask(
            this.fakeOS,
            this.graphicMask
        ));
    }

    /**
     * Refreshes list of notifications.
     */
    public refreshNotifications(): void {
        this.notificationList?.refreshNotifications();
    }

    /**
     * Stores a notification to be launched.
     * @param notification
     */
    public launchNotification(notification: any): void {
        this.pendingNotifications.push(notification);
    }

    /**
     * Shows notification drawer.
     */
    public showDrawer(): void {
        this.fakeOS.log('Launching drawer');
        this.iframe_visibility(false);

        this.UI.isDrawerOpen = true;
        this.fakeOS.tweens.add({
            targets: this.drawerArea,
            y: 0,
            duration: this.fakeOS.cache.json.get('config').notification_drawer_animation_duration,
            onUpdate: () => {
                this.applyMask();
            },
            onComplete: () => {
                this.createDragZone();
            }
        });
    }

    /**
     * Hides notification drawer.
     */
    public hideDrawer(): void {
        this.fakeOS.log('Hiding drawer');

        this.UI.isDrawerOpen = false;
        this.fakeOS.tweens.add({
            targets: this.drawerArea,
            y: -this.fakeOS.height,
            duration: this.fakeOS.cache.json.get('config').notification_drawer_animation_duration,
            onUpdate: () => {
                this.applyMask();
            },
            onStart: () => {
                this.deleteDragZone();
            },
            onComplete: () => {
                this.iframe_visibility(true);
            }
        });
    }

    /**
     * Adds input event listeners.
     */
    public addEvents(): void {
        if (this.drawerLauncher !== undefined) {
            this.fakeOS.addInputEvent(
                'pointerup',
                () => {this.showDrawer()},
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
                () => {this.hideDrawer()},
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

        this.notificationList?.iterate(function(notificationBox: any){
            notificationBox.addOnIconClick();
        });

    }

    public createDragZone(): void {
        if (this.drawerArea == undefined || this.notificationList == undefined) {
            return;
        }

        this.notificationList.setInteractive(new Phaser.Geom.Rectangle(
            this.drawerArea.x,
            this.drawerArea.y,
            this.drawerArea.width,
            this.drawerArea.height
        ), Phaser.Geom.Rectangle.Contains);
        this.fakeOS.input.setDraggable(this.notificationList);

        this.hasDragZone = true;
        this.fakeOS.input.on(
            'drag',
            this.dragFunction,
            this
        );

        this.fakeOS.input.on(
            'gameobjectwheel',
            this.wheelFunction,
            this
        );

    }

    protected dragFunction(pointer:any, gameobject:any, dragX: any, dragY: any)  {
        if (gameobject != this.notificationList || this.drawerArea == undefined || this.notificationList == undefined) {
            return;
        }

        // TO DO: change min
        this.notificationList.y = Math.round(Phaser.Math.Clamp(
            dragY,
            -(this.notificationList.getBounds().height),
            this.UI.elements.topBar.height
        ));
    }

    protected wheelFunction(pointer:any, gameobject:any, deltaX: any, deltaY: any, deltaZ: any) {
        if (gameobject != this.notificationList || this.drawerArea == undefined || this.notificationList == undefined) {
            return;
        }

        // TO DO: change min
        this.notificationList.y = Math.round(Phaser.Math.Clamp(
            this.notificationList.y - deltaY,
            -(this.notificationList.getBounds().height),
            this.UI.elements.topBar.height
        ));
    }

    public deleteDragZone(): void {
        if (this.hasDragZone) {
            this.notificationList?.disableInteractive();
            this.fakeOS.input.off('drag', this.dragFunction);
            this.fakeOS.input.off('wheel', this.wheelFunction);
            this.hasDragZone = false;
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
            if (this.notificationList?.launchNotification(this.pendingNotifications[0])) {
                this.isNotificationYoyoing = true;
            }
            this.pendingNotifications.shift();
        }
    }

    /**
     * Sets iframe visibility (only used for browser app)
     * @param visible
     */
    protected iframe_visibility(visible: boolean): void {
        // TODO: look for a better solution to show browser iframe
        let iframe = document.getElementsByTagName("iframe");
        if (iframe.length > 0) {
            iframe[0].style.visibility = visible ? 'visible' : 'hidden';
        }
    }
}