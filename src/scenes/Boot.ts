import Phaser from 'phaser';
import {dpr} from 'lib/Screen';
import LostAndPhone from 'lib/GameLib';

export default class Boot extends LostAndPhone.Scene {
    constructor() {
        super({ key: 'boot'});
    }

    create() {
        // window.addEventListener('resize', this.resize.bind(this));
        this.scene.start('preloader');
    }

    resize() {
        let w = window.innerWidth * dpr;
        let h = window.innerHeight * dpr;
        // manually resize the game with the Phaser 3.16 scalemanager
        if (w > h) {
            w = h * 0.6 * dpr;
            h = h * dpr;
        } else {
            w = w * dpr;
            h = h * dpr;
        };
        this.scale.resize(w, h);

        // Check which scene is active.
        for (let scene of this.scene.manager.scenes) {
            if (scene.scene.settings.active) {
                // Scale the camera
                scene.cameras.main.setViewport(0, 0, w, h);
                //if (scene.resizeField) {
                    // Scale/position stuff in the scene itself with this method, that the scene must implement.
                    //scene.resizeField(w, h);
                //}
            }
        }
    }
}
