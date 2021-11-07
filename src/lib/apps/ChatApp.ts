import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';
import ChatBubble from '../ui/gameObjects/chat/ChatBubble';
import ChatInteraction from '../ui/gameObjects/chat/ChatInteraction';
import { PhoneEvents } from '../events/GameEvents';
import ChoiceInputArea from '../ui/gameObjects/input/ChoiceInputArea';

/**
 * Gallery app
 */
export default class ChatApp extends App {

    protected chat: any;
    protected contacts: any;
    protected textOptions: any = { align: "left", fontSize: "24px" };
    protected choiceTextOptions: any = { align: "left", fontSize: "24px" };
    protected rowOptions = { autoscroll: true};
    protected activeContact: number;
    protected lastMessage?: string;

    public constructor(fakeOS: FakeOS) {
        super(fakeOS, {rows: 6});
        this.chat = this.fakeOS.cache.json.get('chat');
        this.contacts = [];
        this.activeContact = 0;

        this.textOptions['wordWrap'] = {
            width: this.area.width * 0.6,
            useAdvancedWrap: true
        };
        this.choiceTextOptions['wordWrap'] = {
            width: this.area.width * 0.8,
            useAdvancedWrap: true
        };
    }

    public render(): void {

        for (let i = 0; i < this.chat.length; i++) {

            let pic = this.fakeOS.add.image(-this.area.width / 4 + 40, 0, this.chat[i].id);
            let rectangle = this.fakeOS.add.rectangle(0, 0, this.area.width, this.rowHeight());
            rectangle.setStrokeStyle(1, 0xffffff);
            let radius = Math.min(pic.width, pic.height) / 2;
            //let circle = this.fakeOS.add.graphics().setPosition(0, 0).fillCircle(0, 0, radius);
            //pic.setMask(circle.createGeometryMask());

            let name = this.fakeOS.add.text(0, -pic.height / 6, this.chat[i].contactName, this.textOptions);
            let chatRegistry = this.fakeOS.registry.get('chat');
            let lastTextId = chatRegistry[this.chat[i].id+'_lastchat'];
            this.fakeOS.log('Contact '+this.chat[i].id+' last message was '+lastTextId);
            let lastText = this.fakeOS.getString('no_messages');
            if (lastTextId in this.chat[i].conversation) {
                lastText = this.chat[i].conversation[lastTextId].text;
            }

            let lastMessage = this.fakeOS.add.text(0, 10, lastText, this.textOptions);
            let contact = this.fakeOS.add.container(0, 0, [rectangle, pic, name, lastMessage]);

            let notifications = this.fakeOS.registry.get('notifications');
            if (notifications.find((o:any) => o.contact == this.chat[i]['id'])) {
                lastMessage.text = this.fakeOS.getString('is_typing');
            }

            this.fakeOS.addInputEvent(
                'pointerup',
                () => {
                    this.openChat(i)
                },
                pic
            );

            this.contacts.push(contact);

            this.addRow(contact);
        }
    }

    public openChat(contact: number): void {
        this.activeContact = contact;
        this.fakeOS.log("Opening chat with " + this.chat[this.activeContact].contactName);
        const conversation = this.chat[this.activeContact].conversation;
        this.addLayer(0x333333);

        // Get last message
        this.lastMessage = this.fakeOS.registry.get('chat')[this.chat[this.activeContact].id+'_lastchat'];
        this.fakeOS.log('Contact last message was ' + this.lastMessage);

        let config = {
            key: 'typingAnimation',
            frames: this.fakeOS.anims.generateFrameNumbers('typing', { start: 0, end: 2, first: 0 }),
            frameRate: 6,
            repeat: -1
        };
        this.fakeOS.anims.create(config);

        // Create conversation
        this.createChatInteraction(conversation[Object.keys(conversation)[0]], this.lastMessage == undefined);
    }

    protected createChatInteraction(conversation: any, newMessage: boolean = false): object | null {

        if (conversation == undefined) {
            return null;
        }

        let next = null;

        // Contact balloon
        if (conversation.text !== undefined) {
            next = this.createChatText(conversation, newMessage);
        }

        // User options
        if (conversation.options !== undefined) {
            next = this.createChatOptions(conversation);
        }

        if (!newMessage) {
            return this.createChatInteraction(next, this.lastMessage == conversation.id);
        } else {
            return null;
        }
    }

    protected createChatText(conversation: any, newMessage: boolean = false): object | null {
        if (!this.fakeOS.checkDone(conversation['condition'])) {
            return null;
        } else {
            /*let notifications = this.fakeOS.registry.get('notifications');
            if (notifications.find((o:any) => o.id == conversation['id'])) {
                this.fakeOS.checkDone(conversation['id']);
            }*/
        }
        this.addRow(new ChatInteraction(
            this.fakeOS,
            0,0,
            conversation.id,
            this.chat[this.activeContact].id,
            conversation.text,
            {...this.textOptions, new_message: newMessage}
        ).setName(conversation.id), this.rowOptions);

        this.saveChatRegistry(conversation);
        this.waitForNextConversation(conversation);

        return newMessage ? null : this.getNextConversation(conversation);
    }

    protected createChatOptions(conversation: any): object | null {

        if (!this.fakeOS.checkDone(conversation['id'])) {

            this.addRow(new ChatInteraction(
                this.fakeOS,
                0,0,
                conversation.id,
                'default-avatar',
                conversation.options,
                {...this.textOptions, own_message: true, choose: true, new_message: true }
            ).setName(conversation.id), this.rowOptions);

            this.waitForShowOptions(conversation);

            return null;
        } else {
            let chosen = this.fakeOS.registry.get('chat')[conversation.id];
            this.fakeOS.log('Chosen option was ' + chosen);

            this.addRow(new ChatInteraction(
                this.fakeOS,
                0,0,
                conversation.id,
                'default-avatar',
                conversation.options[chosen].text,
                {...this.textOptions, own_message: true }
            ).setName(conversation.id), this.rowOptions);

            return this.getNextConversation(conversation.options[chosen]);
        }
    }

    protected showOptions(conversation: any): Phaser.GameObjects.Container {

        let choice_area = new ChoiceInputArea(
            this.fakeOS,
            0, 0,
            conversation.options,
            this.choiceTextOptions
        );

        this.addElements(choice_area);

        this.fakeOS.addEventListener(PhoneEvents.OptionSelected, (key: string) => {
            choice_area.destroy();
            let interaction = this.getActiveLayer().getByName(conversation.id);
            interaction.setText(interaction.createText(
                conversation.options[key]['text'],
                {...this.textOptions, own_message: true }
            ));
            this.selectOption(conversation, key);
        });

        return choice_area;

    }

    protected selectOption(conversation: any, key: string): void {
        this.fakeOS.log('You chose option ' + key);

        let chatOptions = this.fakeOS.registry.get('chat');
        chatOptions[conversation.id] = conversation.options[key].id;
        this.fakeOS.setDone(conversation.id);
        this.fakeOS.addData('chat', chatOptions);
        this.createChatInteraction(this.getNextConversation(conversation.options[key]), true);
    }

    protected getNextConversation(conversation: any): any {
        if ('next' in conversation) {
            let next = this.chat[this.activeContact].conversation[conversation.next];
            if (next !== undefined) {
                this.fakeOS.log("Next conversation is " + next.id);
                return next;
            } else {
                return null;
            }
        }
        return null;
    }

    protected waitForNextConversation(conversation: any): void {
        this.fakeOS.addEventListener(PhoneEvents.NewConversation, () => {
            this.fakeOS.removeEventListener(PhoneEvents.NewConversation);
            this.createChatInteraction(this.getNextConversation(conversation), true);
        });
    }

    protected waitForShowOptions(conversation: any): void {
        this.fakeOS.addEventListener(PhoneEvents.ShowOptions, () => {
            this.fakeOS.removeEventListener(PhoneEvents.ShowOptions);
            this.showOptions(conversation);
        });
    }

    protected saveChatRegistry(conversation: any): void {
        this.fakeOS.log("Saving " + this.chat[this.activeContact].id + " last conversation as " + conversation.id);
        let chatRegistry = this.fakeOS.registry.get('chat');
        chatRegistry[this.chat[this.activeContact].id+'_lastchat'] = conversation.id;
        this.fakeOS.addData('chat', chatRegistry);
    }
}