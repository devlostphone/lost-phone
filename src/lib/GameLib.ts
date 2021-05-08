namespace LostAndPhone {
    interface ScreenBaseSize {
        width: number;
        height: number;
        maxWidth: number;
        maxHeight: number;
        minWidth: number;
        minHeight: number;
    }

    export class Game extends Phaser.Game {
        screenBaseSize?: ScreenBaseSize;
        orientation?: string;

        constructor(config:  Phaser.Types.Core.GameConfig) {
            super(config);
        }

        runDestroy() {

        }
    }

    export class Scene extends Phaser.Scene {
        sceneRunning?: string;
        parent?: Phaser.Structs.Size;
        sizer?: Phaser.Structs.Size;
        width?: number;
        height?: number;
        sceneStopped: boolean;

        constructor(config:string | Phaser.Types.Scenes.SettingsConfig) {
            super(config);
            this.sceneStopped = false;
        }
    }
}

export default LostAndPhone;

