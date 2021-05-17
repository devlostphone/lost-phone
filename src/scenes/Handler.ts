import Phaser from 'phaser';
import LostAndPhone from 'lib/GameLib';

export default class Handler extends LostAndPhone.Scene {

    public gameScene?: LostAndPhone.Scene;

    constructor() {
        super({ key : 'handler' });
    }

    public create() {
        this.launchScene('boot');
    }

    public launchScene(scene: string, data = undefined) {
        this.scene.launch(scene, data);
        let gameScene = this.scene.get(scene);

        if (gameScene instanceof LostAndPhone.Scene) {
            this.gameScene = gameScene;
        }
    }

    public updateResize(scene: LostAndPhone.Scene) {
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

    public resize(gameSize: LostAndPhone.Scene) {
        // 'this' means current scene that is running
        if (!this.sceneStopped) {
            const width = gameSize.width;
            const height = gameSize.height;

            this.parent?.setSize(width, height);
            this.sizer?.setSize(width, height);

            // updateCamera - TO DO: Improve the next code because it is duplicated
            const camera = this.cameras.main;

            if (this.game instanceof LostAndPhone.Game) {
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
    }

    public updateCamera(scene: LostAndPhone.Scene) {
        const camera = scene.cameras.main;
        if (this.game instanceof LostAndPhone.Game) {
            if (scene.sizer?.width !== undefined && this.game.screenBaseSize !== undefined) {
                const scaleX = scene.sizer.width / this.game.screenBaseSize.width;
                const scaleY = scene.sizer.height / this.game.screenBaseSize.height;

                let zoom = Math.max(scaleX, scaleY);
                camera.setZoom(zoom);
                camera.centerOn(this.game.screenBaseSize.width / 2, this.game.screenBaseSize.height / 2);
            }
        }
    }

}
