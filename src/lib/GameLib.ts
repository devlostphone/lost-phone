import Phaser from "phaser";
/**
 * Extend Phaser Game and Scene.
 */
declare global {
    namespace Phaser {

        interface ScreenBaseSize {
            width: number;
            height: number;
            maxWidth: number;
            maxHeight: number;
            minWidth: number;
            minHeight: number;
        }
        interface Game {
            screenBaseSize?: ScreenBaseSize;
            orientation?: string;
        }

        interface Scene {
            handlerScene: Phaser.Scene;
            sceneRunning?: string;
            sceneStopped: boolean;

            parent?: Phaser.Structs.Size;
            sizer?: Phaser.Structs.Size;
            width: number;
            height: number;
        }
    }
}

/**
 * Extended Phaser Scene.
 */
export class FakeOSScene extends Phaser.Scene {
    /**
     * Class constructor.
     *
     * @param config
     */
    public constructor(config:string | Phaser.Types.Scenes.SettingsConfig) {
        super(config);
        this.sceneStopped = false;
        this.width = 0;
        this.height = 0;
    }

    /**
     * Scene preload method.
     */
    public preload(): void {
        if (this.game.screenBaseSize !== undefined) {
            this.width = this.game.screenBaseSize.width;
            this.height = this.game.screenBaseSize.height;
        }

        let handler = this.scene.get('handler');
        this.handlerScene = handler;
    }
}


