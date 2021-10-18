import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';

/**
 * Gallery app
 */
export default class ChatApp extends App {

    protected chat: any;
    protected contacts: any;

    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.chat = this.fakeOS.cache.json.get('chat');
        this.contacts = [];
    }

    public render(): void {

        for (let i = 0; i < this.chat.length; i++) {

            let pic = this.fakeOS.add.image(0, 0, this.chat[i].id);
            let name = this.fakeOS.add.text(0, 0, this.chat[i].contactName);
            let contact = this.fakeOS.add.container(0, 0, [pic, name]);

            this.fakeOS.addInputEvent(
                'pointerup',
                () => {
                    this.openChat(i)
                },
                pic
            );

            this.contacts.push(contact);
        }

        this.addGrid(
            this.contacts,
            {
                columns: 2,
                rows: 4
            }
        );
    }

    public openChat(contact: number): void {
        this.fakeOS.log("Opening chat with " + this.chat[contact].contactName);
        const conversation = this.chat[contact].conversation;
        this.addLayer(0x333333);

        for (let i = 0; i < conversation.length; i++) {

            let pic = this.fakeOS.add.image(0, 0, this.chat[contact].id);

            if (conversation.text !== undefined) {
                let text = this.fakeOS.add.text(0, 0, conversation.text);
                this.addRow([pic, '', text, '']);
            }

            if (conversation.options !== undefined) {

            }
        }
    }
}