import { FakeOS } from '~/scenes/FakeOS';
import App from '~/lib/apps/App';
import ChatBubble from '../ui/gameObjects/chat/ChatBubble';

/**
 * Gallery app
 */
export default class ChatApp extends App {

    protected chat: any;
    protected contacts: any;
    protected textOptions = { align: "left", fontSize: "24px", wordWrap: { width: 300, useAdvancedWrap: true }};
    protected rowOptions = { height: 2, autoscroll: true};
    protected activeContact: number;
    protected lastMessage?: string;

    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.chat = this.fakeOS.cache.json.get('chat');
        this.contacts = [];
        this.activeContact = 0;
    }

    public render(): void {

        for (let i = 0; i < this.chat.length; i++) {

            let pic = this.fakeOS.add.image(-this.area.width / 4 + 40, 0, this.chat[i].id);
            let rectangle = this.fakeOS.add.rectangle(0, 0, this.area.width, this.rowHeight()*2);
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

            this.addRow(contact, {height: 2});
        }
    }

    public openChat(contact: number): void {
        this.fakeOS.addBackFunction(() => {
            this.fakeOS.launchApp(this.fakeOS.getActiveApp().getKey());
        });

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

        let pic = this.fakeOS.add.image(0, 0, this.chat[this.activeContact].id);
        if (newMessage) {
            let typing = this.fakeOS.add.sprite(0, 0, 'typing').play('typingAnimation');
            this.addRow([pic, typing], this.rowOptions);
            this.fakeOS.log("Saving " + this.chat[this.activeContact].id + " last conversation as " + conversation.id);
            let chatRegistry = this.fakeOS.registry.get('chat');
            chatRegistry[this.chat[this.activeContact].id+'_lastchat'] = conversation.id;
            this.fakeOS.addData('chat', chatRegistry);

            let timedEvent = this.fakeOS.time.delayedCall(
                1500,
                () => {
                    pic.destroy();
                    typing.destroy();
                    pic = this.fakeOS.add.image(0, 0, this.chat[this.activeContact].id);
                    //let text = this.fakeOS.add.text(0, 0, conversation.text, this.textOptions);
                    let text = new ChatBubble(this.fakeOS, 0, 0, conversation.text, this.textOptions);
                    this.addRow([pic, text], {...this.rowOptions, y: this.lastY - 2});
                    this.createChatInteraction(this.getNextConversation(conversation), true);
                }
            );

        } else {
            //let text = this.fakeOS.add.text(0, 0, conversation.text, this.textOptions);
            let text = new ChatBubble(this.fakeOS, 0, 0, conversation.text, this.textOptions);
            this.addRow([pic, text], this.rowOptions);
        }

        return this.getNextConversation(conversation);
    }

    protected createChatOptions(conversation: any): object | null {
        let avatar = this.fakeOS.add.image(0, 0, 'default-avatar').setScale(0.5, 0.5);

        if (!this.fakeOS.checkDone(conversation['id'])) {
            let typing = this.fakeOS.add.sprite(0, 0, 'typing').play('typingAnimation');
            this.addRow([typing, avatar], this.rowOptions);

            let timedEvent = this.fakeOS.time.delayedCall(
                600,
                () => {
                    //avatar.destroy();
                    //typing.destroy();
                    //avatar = this.fakeOS.add.image(0, 0, 'default-avatar').setScale(0.5, 0.5);
                    let options = this.showOptions(conversation);
                    //this.addRow([options, avatar], { ...this.rowOptions, y: this.lastY - 2});
                }
            );

            return null;
        } else {
            let chosen = this.fakeOS.registry.get('chat')[conversation.id];
            this.fakeOS.log('Chosen option was ' + chosen);
            //let text = this.fakeOS.add.text(0,0, conversation.options[chosen].text, this.textOptions);
            let text = new ChatBubble(this.fakeOS, 0, 0, conversation.options[chosen].text, this.textOptions, true);
            this.addRow([text, avatar], this.rowOptions);
            return this.getNextConversation(conversation.options[chosen]);
        }
    }

    protected showOptions(conversation: any): Phaser.GameObjects.Container {
        let pos = 0;
        let starting_pos = this.fakeOS.getActiveApp().area.height - 200;
        let options = this.fakeOS.add.container(0,starting_pos);
        let option_area = options.add(this.fakeOS.add.rectangle(
            0,
            0,
            this.fakeOS.getActiveApp().area.width,
            200,
            0x999999
        ).setOrigin(0, 0));
        for (const key in conversation.options) {
            let option = this.fakeOS.add.text(
                this.fakeOS.getActiveApp().area.width / 2 - 100,
                (pos*70) + 30,
                conversation.options[key]['text'],
                this.textOptions
            );
            this.fakeOS.addInputEvent('pointerover', () => { option.setTint(0x00cc00)}, option);
            this.fakeOS.addInputEvent('pointerout', () => { option.clearTint()}, option);
            this.fakeOS.addInputEvent('pointerup', () =>  {
                options.removeAll(true);
                //let option = this.fakeOS.add.text(0, - 30, conversation.options[key]['text'], this.textOptions);
                let option = new ChatBubble(this.fakeOS, 0, 0, conversation.options[key]['text'], this.textOptions, true);
                options.add(option);
                let avatar = this.fakeOS.add.image(0, 0, 'default-avatar').setScale(0.5, 0.5);
                this.addRow([options, avatar], { ...this.rowOptions, y: this.lastY - 2});
                this.selectOption(conversation, key);
            }, option);
            options.add(option);
            pos++;
        }
        return options;
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
}