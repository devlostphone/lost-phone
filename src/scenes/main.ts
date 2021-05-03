export default class Main extends Phaser.Scene
{
    constructor ()
    {
        super('main');
    }

    create ()
    {
        this.add.text(0, 0, 'Hello World');
    }
}