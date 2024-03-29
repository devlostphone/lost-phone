import { FakeOS } from "../../../../scenes/FakeOS";

/**
 * Mail Content
 * @todo: add scroll for long emails.
 */
export default class MailContent extends Phaser.GameObjects.Container
{
    protected fakeOS: FakeOS;
    public constructor(
        scene: FakeOS,
        x: number, y: number,
        mail: any,
        textOptions?: any
    ){
        super(scene, x, y, []);
        this.fakeOS = scene;
        this.setSize(
            this.fakeOS.getActiveApp().area.width,
            this.fakeOS.getActiveApp().rowHeight()
        );

        let subject = this.fakeOS.add.rexBBCodeText(
            -this.fakeOS.getActiveApp().area.width / 2 + 400 ,
            32,
            mail.subject,
            {
                fontSize: "36px",
                align: "left",
                color: '#efefef',
                fontFamily: 'Roboto',
            }
        );

        let line1 = this.fakeOS.add.line(
            0,0,
            0,96,
            this.fakeOS.getActiveApp().area.width*2,96,
            0xafafaf
        );

        let icon = this.fakeOS.add.image(
            -this.fakeOS.getActiveApp().area.width / 2 + 400,
            118,
            mail.icon).setOrigin(0);

        let from = this.fakeOS.add.text(
            -this.fakeOS.getActiveApp().area.width / 2 + 460,
            115,
            "De: " + mail.from,
            {
                fontSize: "24px",
                align: "left",
                color: '#efefef',
                fontFamily: 'Roboto-Bold',
            }
        )

        let to = this.fakeOS.add.rexBBCodeText(
            -this.fakeOS.getActiveApp().area.width / 2 + 460,
            142,
            "A: [color=cyan]" + mail.to + "[/color]",
            {
                fontSize: "24px",
                align: "left",
                color: '#efefef',
                fontFamily: 'Roboto',
            }
        )

        let date = this.fakeOS.add.text(
            -this.fakeOS.getActiveApp().area.width / 2 + 820,
            118,
            "📩 " + mail.date + "\n" + mail.hour,
            {
                fontSize: "24px",
                align: "right",
                color: '#efefef',
                fontFamily: 'Roboto',
            }
        )

        let line2 = this.fakeOS.add.line(
            0,0,
            0,180,
            this.fakeOS.getActiveApp().area.width*2,180,
            0xafafaf
        );

        let body = this.fakeOS.add.rexBBCodeText(
            -this.fakeOS.getActiveApp().area.width / 2 + 400,
            200,
            mail.body,
            {
                fontSize: "24px",
                align: "left",
                color: '#efefef',
                fontFamily: 'Roboto',
                wrap: {
                    mode: 'word',
                    width: 680
                },
            }
        );
        this.add([subject, line1, icon, from, to, date, line2, body]);

        /**
         * Attachments
         * Need to be rewrite: instead of showing thubnail
         */

        /*
          let attachment_sz = mail.attachment.length;
          if (attachment_sz > 0) {
          for(let i = 0; i < attachment_sz; i++) {
          this.add([this.fakeOS.add.image(
          -this.fakeOS.getActiveApp().area.width / 2 + 400,
          118,
          mail.attachment[i]).setOrigin(0)
          ]);
          }
          }
        */

}
