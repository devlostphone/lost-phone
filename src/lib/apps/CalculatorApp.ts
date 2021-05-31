import App from '~/lib/apps/App';
import {FakeOS} from '~/scenes/FakeOS';

// Explore how to create UIbutton following this tutorial:
// https://blog.ourcade.co/posts/2020/container-button-phaser-3-typescript-rxjs/
// The concept is define a button as a container to hold a Button (image) and Text object.

// Why the hell we need an interface to implementing the button class?
declare global {
    interface IButton extends Phaser.GameObjects.GameObject, Phaser.GameObjects.Components.Transform  {

        onClick(): Observable<Phaser.Input.Pointer>;

        setOverTint(tint: number): this;
        setDisabled(disabled: boolean): this;
    }

    interface IButtonContainer extends IButton {
        setText(text: string): this;
        setTextStyle(style: object): this;
    }
}

export default class Button extends Phaser.GameObjects.Image implements IButton {
}

export default class ButtonContainer extends Phaser.GameObjects.Container implements IButtonContainer {

    private button: IButton;
    private text: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, tint: number = 0xffffff) {
        super(scene, x, y);

        this.button = new Button(scene, 0, 0, texture, tint);
        this.text = scene.add.text(0, 0, 'Button', { color: 'black' }).setOrigin(0.5, 0.5);
        this.add(this.button);
        this.add(this.text);
    }

    onClick() {
        return this.button.onClick();
    }

    setText(text: string) {
        this.text.text = text;
        return this;
    }

    setTextStyle(style: object) {
        this.text.setStyle(style);
        return this;
    }

    setUpTint(tint: number) {
        this.button.setUpTint(tint)
        return this;
    }

    // ... implement the rest of the IButton methods...
}

export default class CalculatorApp extends App {


    const Orange = 0xFFAD00;
    /**
     * Class constructor.
     *
     * @param scene
     */
    public constructor(scene: FakeOS) {
        super(scene);
    }

    /**
     * Render method.
     */
    public render(): void {
        console.log("Calculatorapp.render()");

        const button = this.add.buttonContainer(320, 320, 'app', Orange)
            .setText('Sample Button');
    }

    /**
     * Update method.
     *
     * @param delta
     * @param time
     */
    public update(delta: any, time: any): void {

    }

}
