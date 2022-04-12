import Phaser from 'phaser';
import {FakeOSScene} from '/src/lib/GameLib';

/**
 * Scene for handling resizing.
 */
export default class Handler extends FakeOSScene {

    /**
     * Game scene.
     */
    public gameScene?: FakeOSScene;

    /**
     * Class constructor.
     */
    public constructor() {
        super({ key : 'handler' });
    }

    /**
     * Create method.
     */
    public create(): void {
        this.launchScene('boot');
    }

    /**
     * Launch scene method.
     *
     * @param scene
     * @param data
     */
    public launchScene(scene: string, data = undefined): void {
        this.scene.launch(scene, data);
        let gameScene = this.scene.get(scene);
        if (gameScene instanceof FakeOSScene) {
            this.gameScene = gameScene;
        }

    }

    /**
     * Update resize method.
     *
     * @param scene
     */
    public updateResize(scene: FakeOSScene): void {
        scene.scale.on('resize', this.resize, scene);

        const scaleWidth = scene.scale.gameSize.width;
        const scaleHeight = scene.scale.gameSize.height;

        scene.parent = new Phaser.Structs.Size(scaleWidth, scaleHeight);
        scene.sizer = new Phaser.Structs.Size(
            scene.width, scene.height,
            Phaser.Structs.Size.FIT,
            scene.parent
        );

        scene.parent.setSize(scaleWidth, scaleHeight);
        scene.sizer.setSize(scaleWidth, scaleHeight);

        this.updateCamera(scene);
    }

    /**
     * Resize method.
     *
     * @param gameSize
     */
    public resize(gameSize: FakeOSScene): void {
        // 'this' means current scene that is running
        if (!this.sceneStopped) {
            const width = gameSize.width;
            const height = gameSize.height;

            this.parent?.setSize(width, height);
            this.sizer?.setSize(width, height);

            // updateCamera - TO DO: Improve the next code because it is duplicated
            const camera = this.cameras.main;

            if (this.sizer?.width !== undefined && this.game.screenBaseSize !== undefined) {
                const scaleX = this.sizer.width / this.game.screenBaseSize?.width;
                const scaleY = this.sizer.height / this.game.screenBaseSize?.height;

                let zoom = Math.max(scaleX, scaleY);
                camera.setZoom(zoom);
            }

            if (this.game.screenBaseSize !== undefined) {
                camera.centerOn(this.game.screenBaseSize.width / 2, this.game.screenBaseSize.height / 2);
            }
        }
    }

    /**
     * Update camera method.
     *
     * @param scene
     */
    public updateCamera(scene: FakeOSScene): void {
        const camera = scene.cameras.main;
        if (scene.sizer?.width !== undefined && this.game.screenBaseSize !== undefined) {
            const scaleX = scene.sizer.width / this.game.screenBaseSize.width;
            const scaleY = scene.sizer.height / this.game.screenBaseSize.height;

            let zoom = Math.max(scaleX, scaleY);
            camera.setZoom(zoom);
            camera.centerOn(this.game.screenBaseSize.width / 2, this.game.screenBaseSize.height / 2);
        }
    }
}
