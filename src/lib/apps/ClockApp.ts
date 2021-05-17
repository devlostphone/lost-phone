import App from 'lib/apps/App';
import FakeOS from 'scenes/FakeOS';

export default class ClockApp extends App {

    clockSize: number;
    graphics?: Phaser.GameObjects.Graphics;
    angle?: number;
    size?: number;
    dest?: any;
    p1?: any;
    p2?: any;
    date?: Date;
    hours?: number;
    mins?: number;
    seconds?: number;

    x: number;
    y: number;

    constructor(scene: FakeOS) {
        super(scene);
        this.x = scene.width / 2;
        this.y = scene.height / 2;
        this.clockSize = Math.round(this.scene.width / 2.5);
    }

    public render() {
        this.graphics = this.scene.add.graphics();
        this.elements.add(this.graphics);
    }

    public update(delta: any, time: any) {
        let p1;
        let p2;

        if (this.graphics === undefined) {
            return;
        }

        // Clear the graphics every frame
        this.graphics.clear();
        // The frame
        this.graphics.fillStyle(this.scene.colors.blue, 0.5);
        this.graphics.lineStyle(10, this.scene.colors.white, 0.5);
        this.graphics.fillCircle(this.x, this.y, this.clockSize);
        this.graphics.strokeCircle(this.x, this.y, this.clockSize);

        this.date = new Date;
        this.seconds = this.date.getSeconds() / 60;
        this.mins = this.date.getMinutes() / 60;
        // @BUG: No dóna correctament les hores!
        // @DONE: Recorda que el rellotge no és de 24 hores, sinó de 12!
        // Aquest bug es compartit amb la font oroginal
        this.hours = this.date.getHours() / 12;

        //---  The hours hand
        this.size = this.clockSize * 0.8;
        this.angle = (360 * this.hours) - 90;
        this.dest = Phaser.Math.RotateAroundDistance({ x: this.x, y: this.y }, this.x, this.y, Phaser.Math.DegToRad(this.angle), this.size);
        this.graphics.fillStyle(0xff0000, 0.7);
        this.graphics.beginPath();
        this.graphics.moveTo(this.x, this.y);
        p1 = Phaser.Math.RotateAroundDistance({ x: this.x, y: this.y }, this.x, this.y, Phaser.Math.DegToRad(this.angle - 5), this.size * 0.7);
        this.graphics.lineTo(p1.x, p1.y);
        this.graphics.lineTo(this.dest.x, this.dest.y);
        this.graphics.moveTo(this.x, this.y);
        p2 = Phaser.Math.RotateAroundDistance({ x: this.x, y: this.y }, this.x, this.y, Phaser.Math.DegToRad(this.angle + 5), this.size * 0.7);
        this.graphics.lineTo(p2.x, p2.y);
        this.graphics.lineTo(this.dest.x, this.dest.y);
        this.graphics.fillPath();
        this.graphics.closePath();

        //--- The minutes hand
        this.size = this.clockSize * 0.9;
        this.angle = (360 * this.mins) - 90;
        this.dest = Phaser.Math.RotateAroundDistance({ x: this.x, y: this.y }, this.x, this.y, Phaser.Math.DegToRad(this.angle), this.size);
        this.graphics.fillStyle(0x0000ff, 0.7);
        this.graphics.beginPath();
        this.graphics.moveTo(this.x, this.y);
        p1 = Phaser.Math.RotateAroundDistance({ x: this.x, y: this.y }, this.x, this.y, Phaser.Math.DegToRad(this.angle - 5), this.size * 0.5);
        this.graphics.lineTo(p1.x, p1.y);
        this.graphics.lineTo(this.dest.x, this.dest.y);
        this.graphics.moveTo(this.x, this.y);
        p2 = Phaser.Math.RotateAroundDistance({ x: this.x, y: this.y }, this.x, this.y, Phaser.Math.DegToRad(this.angle + 5), this.size * 0.5);
        this.graphics.lineTo(p2.x, p2.y);
        this.graphics.lineTo(this.dest.x, this.dest.y);
        this.graphics.fillPath();
        this.graphics.closePath();

        //--- The seconds hand
        this.size = this.clockSize * 0.9;
        this.angle = (360 * this.seconds) - 90;
        this.dest = Phaser.Math.RotateAroundDistance({ x: this.x, y: this.y }, this.x, this.y, Phaser.Math.DegToRad(this.angle), this.size);
        this.graphics.fillStyle(0x00ff00, 0.7);
        this.graphics.beginPath();
        this.graphics.moveTo(this.x, this.y);
        p1 = Phaser.Math.RotateAroundDistance({ x: this.x, y: this.y }, this.x, this.y, Phaser.Math.DegToRad(this.angle - 5), this.size * 0.3);
        this.graphics.lineTo(p1.x, p1.y);
        this.graphics.lineTo(this.dest.x, this.dest.y);
        this.graphics.moveTo(this.x, this.y);
        p2 = Phaser.Math.RotateAroundDistance({ x: this.x, y: this.y }, this.x, this.y, Phaser.Math.DegToRad(this.angle + 5), this.size * 0.3);
        this.graphics.lineTo(p2.x, p2.y);
        this.graphics.lineTo(this.dest.x, this.dest.y);
        this.graphics.fillPath();
        this.graphics.closePath();
    }
}
