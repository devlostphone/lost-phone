import Button from '~/lib/ui/gameObjects/ButtonUI';

declare global
{
    interface IButtonContainer extends IButton
    {
        setText(text: string): this
        setTextStyle(style: object): this
    }
}

// export default class ButtonContainer extends Phaser.GameObjects.Container implements IButtonContainer {

//     private button: IButton;
//     private text: Phaser.GameObjects.Text;

//     constructor(scene: Phaser.Scene, x: number, y: number, texture: string, tint: number = 0xffffff) {
//         super(scene, x, y);

        // this.button = new Button(scene, 0, 0, texture, tint);
        // this.text = scene.add.text(0, 0, 'Button', { color: 'black' }).setOrigin(0.5, 0.5);
        // this.add(this.button);
        // this.add(this.text);
    }

    // onClick() {
    //     return this.button.onClick();
    // }

    // setText(text: string) {
    //     this.text.text = text;
    //     return this;
    // }

    // setTextStyle(style: object) {
    //     this.text.setStyle(style);
    //     return this;
    // }

    // setUpTexture(texture: string) {
    //     this.button.setUpTexture(texture);
    //     return this;
    // }

    // setUpTint(tint: number) {
    //     this.button.setUpTint(tint)
    //     return this;
    // }

    // setDownTexture(texture: string) {
    //     this.button.setDownTexture(texture);
    //     return this;
    // }

    // setDownTint(tint: number) {
    //     this.button.setDownTint(tint);
    //     return this;
    // }

    // setOverTexture(texture: string) {
    //     this.button.setOverTexture(texture);
    //     return this;
    // }

    // setDisabledTexture(texture: string) {
    //     this.button.setDisabledTexture(texture);
    //     return this;
    // }

    // setOverTint(tint: number) {
    //     this.button.setOverTint(tint);
    //     return this;
    // }

    // setDisabled(disabled: boolean) {
    //     this.button.setDisabled(true);
    //     return this;
    // }
}

// we can also get a little fancy and augment Phaser's GameObjectFactory
// This will allow us to use a nicer, idiomatic syntax like: this.add.buttonContainer()
// Phaser.GameObjects.GameObjectFactory.register('buttonContainer', function (x: number, y: number, key: string, tint: number = 0xffffff) {
//     // @ts-ignore
//     return this.displayList.add(new ButtonContainer(this.scene, x, y, key, tint))
// })
