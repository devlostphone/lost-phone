/**
 * LostAndPhone module.
 */
module LostAndPhone {
    interface ScreenBaseSize {
        width: number;
        height: number;
        maxWidth: number;
        maxHeight: number;
        minWidth: number;
        minHeight: number;
    }

    /**
     * Extended Phaser Game.
     */
    export class Game extends Phaser.Game {
        public screenBaseSize?: ScreenBaseSize;
        public orientation?: string;

        /**
         * Class constructor.
         *
         * @param config
         */
        public constructor(config:  Phaser.Types.Core.GameConfig) {
            super(config);
        }

        // TODO: review this.
        public runDestroy(): void {}
    }

    /**
     * Extended Phaser Scene.
     */
    export class Scene extends Phaser.Scene {
        public handlerScene?: Phaser.Scene;
        public sceneRunning?: string;
        public sceneStopped: boolean;

        public parent?: Phaser.Structs.Size;
        public sizer?: Phaser.Structs.Size;
        public width: number;
        public height: number;

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

