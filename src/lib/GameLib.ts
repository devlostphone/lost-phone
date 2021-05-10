module LostAndPhone {
    interface ScreenBaseSize {
        width: number;
        height: number;
        maxWidth: number;
        maxHeight: number;
        minWidth: number;
        minHeight: number;
    }

    export class Game extends Phaser.Game {
        public screenBaseSize?: ScreenBaseSize;
        public orientation?: string;

        constructor(config:  Phaser.Types.Core.GameConfig) {
            super(config);
        }

        public runDestroy() {

        }
    }

    export class Scene extends Phaser.Scene {
        public handlerScene?: Phaser.Scene;
        public sceneRunning?: string;
        public sceneStopped: boolean;

        public parent?: Phaser.Structs.Size;
        public sizer?: Phaser.Structs.Size;
        public width: number;
        public height: number;

        constructor(config:string | Phaser.Types.Scenes.SettingsConfig) {
            super(config);
            this.sceneStopped = false;
            this.width = 0;
            this.height = 0;
        }

        public preload() {
            if (this.game instanceof Game && this.game.screenBaseSize !== undefined) {
                this.width = this.game.screenBaseSize.width;
                this.height = this.game.screenBaseSize.height;
            }

            let handler = this.scene.get('handler');
            this.handlerScene = handler;
        }
    }
}

export default LostAndPhone;

