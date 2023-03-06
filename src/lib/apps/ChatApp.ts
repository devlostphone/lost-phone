import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';
import ChatInteraction from '../ui/gameObjects/chat/ChatInteraction';
import { PhoneEvents } from '../events/GameEvents';
import ChoiceInputArea from '../ui/gameObjects/input/ChoiceInputArea';
import ChatSummary from '../ui/gameObjects/chat/ChatSummary';
import ChatTopBar from '../ui/gameObjects/chat/ChatTopBar';

/**
 * Chat app
 */
export default class ChatApp extends App {

    protected chat: any;
    protected contacts: any;
    protected textOptions: any = { align: "left", fontSize: "24px" };
    protected choiceTextOptions: any = { align: "left", fontSize: "24px" };
    protected newRowOptions = { autoscroll: true };
    protected rowOptions = { autoscroll: 'fast' };
    protected activeContact: number;
    protected lastMessage?: string;

    /**
     * Class constructor.
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS, {rows: 6});
        this.chat = this.fakeOS.cache.json.get('chat');
        this.contacts = [];
        this.activeContact = 0;

        this.textOptions['wordWrap'] = {
            width: this.area.width * 0.7,
            useAdvancedWrap: true
        };
        this.choiceTextOptions['wordWrap'] = {
            width: this.area.width * 0.8,
            useAdvancedWrap: true
        };
    }

    /**
     * @inheritdoc
     */
    public render(): void {

        for (let i = 0; i < this.chat.length; i++) {

            let lastText = this.getChatLastMessage(this.chat[i], true);
            this.fakeOS.log('Contact '+this.chat[i].id+' last message was '+lastText);

            let contact = new ChatSummary(
                this.fakeOS,
                0, 0,
                this.chat[i],
                lastText,
                this.textOptions
            );

            this.fakeOS.addInputEvent(
                'pointerup',
                () => {
                    this.openChat(i)
                },
                contact
            );

            this.contacts.push(contact);

            this.addRow(contact);
        }
    }

    /**
     * Returns chat last message id.
     *
     * @param chat
     * @returns
     */
    protected getChatLastMessageId(chat: any): string | undefined {
        let chatRegistry = this.fakeOS.registry.get('chat');
        let lastTextId = chatRegistry[chat.id+'_lastchat'];
        let initialLastTextId = chat.lastMessage;

        if (lastTextId in chat.conversation) {
            return lastTextId;
        } else if (initialLastTextId in chat.conversation) {
            return initialLastTextId;
        }

        return undefined;
    }

    /**
     * Returns chat last message text.
     *
     * @param chat
     * @returns
     */
    protected getChatLastMessage(chat: any, chatList: boolean = false): string {
        let lastText = undefined;

        let lastTextId = this.getChatLastMessageId(chat);
        if (lastTextId !== undefined) {
            lastText = chat.conversation[lastTextId].text;
        }

        if (chatList) {
            if (/^gallery/.test(lastText)) {
                lastText = this.fakeOS.getString('user-sent-picture');
            }

            if (lastText === undefined) {
                lastText = this.fakeOS.getString('no-messages');
            }
            let notifications = this.fakeOS.registry.get('notifications');
            if (notifications.find((o:any) => o.contact == chat['id'])) {
                lastText = this.fakeOS.getString('is_typing');
            }
        }

        return lastText;
    }

    /**
     * @inheritdoc
     */
    public goToID(id: string, skipLayerChangeAnim = false): void {
        this.skipLayerChangeAnim = skipLayerChangeAnim;
        for (let contact = 0; contact < this.chat.length; contact++) {
            if (this.chat[contact].id == id || id in this.chat[contact].conversation) {
                this.openChat(contact);
                break;
            }
        }

    }

    /**
     * @inheritdoc
     */
    public getCurrentID(): string {
        return this.chat[this.activeContact].id;
    }

    /**
     * Opens up a single chat conversation.
     *
     * @param contact
     */
    public openChat(contact: number): void {
        this.activeContact = contact;
        this.fakeOS.log("Opening chat with " + this.chat[this.activeContact].contactName);
        const conversation = this.chat[this.activeContact].conversation;
        this.addLayer(0x333333);

        // Get last message
        this.lastMessage = this.getChatLastMessageId(this.chat[this.activeContact]);
        this.fakeOS.log('Contact last message was ' + this.lastMessage);

        let config = {
            key: 'typingAnimation',
            frames: this.fakeOS.anims.generateFrameNumbers('typing', { start: 0, end: 2, first: 0 }),
            frameRate: 6,
            repeat: -1
        };
        this.fakeOS.anims.create(config);

        // Create top bar with avatar
        this.createTopBar(this.chat[this.activeContact]);

        // Create conversation
        this.createChatInteraction(conversation[Object.keys(conversation)[0]], this.lastMessage === undefined);
    }

    /**
     * Creates the conversation top bar with contact picture.
     *
     * @param conversation
     */
    protected createTopBar(conversation: any) {
        let topBar = new ChatTopBar(
            this.fakeOS,
            300,
            20,
            conversation
        );
        this.fakeOS.getUI().fixedElements?.add(topBar);
    }

    /**
     * Creates a single chat interaction and then calls the next one.
     *
     * @param conversation
     * @param newMessage
     * @returns
     */
    protected createChatInteraction(conversation: any, newMessage: boolean = false): object | null {

        if (conversation === undefined || conversation === null) {
            return null;
        }

        let next = null;

        // Contact balloon
        if (conversation.text !== undefined) {
            next = this.createChatText(conversation, newMessage);
        }

        // User options
        if (conversation.options !== undefined) {
            if (Object.keys(conversation.options).length == 1) {
                let chatOptions = this.fakeOS.registry.get('chat');
                chatOptions[conversation.id] = conversation.options[Object.keys(conversation.options)[0]].id;
                this.fakeOS.setDone(conversation.id);
                this.fakeOS.addData('chat', chatOptions);
            }

            next = this.createChatOptions(conversation);
        }

        if (!newMessage) {
            return this.createChatInteraction(next, this.lastMessage == conversation.id);
        } else {
            return null;
        }
    }

    /**
     * Creates a plain text chat interaction.
     *
     * @param conversation
     * @param newMessage
     * @returns
     */
    protected createChatText(conversation: any, newMessage: boolean = false): object | null {
        if (!this.fakeOS.checkDone(conversation['condition'])) {
            return null;
        } else {
            this.fakeOS.log("Checking conversation " + conversation['id'] + ' as done.');
            let notifications = this.fakeOS.registry.get('notifications');
            this.fakeOS.setDone(conversation['id']);
        }

        this.addRow(new ChatInteraction(
                this.fakeOS,
                0,0,
                conversation.id,
                conversation.text,
                conversation.author,
                conversation.time,
                {...this.textOptions, new_message: newMessage, notification: conversation.notification}
            ).setName(conversation.id),
            newMessage ? this.newRowOptions : this.rowOptions
        );

        if (newMessage) {
            this.saveChatRegistry(conversation);
            this.waitForNextConversation(conversation);
        }

        return newMessage ? null : this.getNextConversation(conversation);
    }

    /**
     * Creates a choice interaction where the user selects the answer.
     *
     * @param conversation
     * @returns
     */
    protected createChatOptions(conversation: any): object | null {

        if (!this.fakeOS.checkDone(conversation['id'])) {

            this.addRow(new ChatInteraction(
                this.fakeOS,
                0,0,
                conversation.id,
                conversation.options,
                conversation.author,
                conversation.time,
                {...this.textOptions, own_message: true, choose: true, new_message: true }
            ).setName(conversation.id), this.newRowOptions);

            this.waitForShowOptions(conversation);

            return null;
        } else {
            let chosen = this.fakeOS.registry.get('chat')[conversation.id];
            this.fakeOS.log('Chosen option was ' + chosen);

            this.addRow(new ChatInteraction(
                this.fakeOS,
                0,0,
                conversation.id,
                conversation.options[chosen].text,
                conversation.author,
                conversation.time,
                {...this.textOptions, own_message: true }
            ).setName(conversation.id), this.rowOptions);

            return this.getNextConversation(conversation.options[chosen]);
        }
    }

    /**
     * Shows the list of options for a choice interaction.
     *
     * @param conversation
     * @returns
     */
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
                conversation.options[key]['author'],
                conversation.options[key]['time'],
                {...this.textOptions, own_message: true }
            ));
            this.selectOption(conversation, key);
        }, true);

        return choice_area;

    }

    /**
     * Stores the selected option and continues the conversation.
     *
     * @param conversation
     * @param key
     */
    protected selectOption(conversation: any, key: string): void {
        this.fakeOS.log('You chose option ' + key);

        let chatOptions = this.fakeOS.registry.get('chat');
        chatOptions[conversation.id] = conversation.options[key].id;
        this.fakeOS.setDone(conversation.id);
        this.fakeOS.addData('chat', chatOptions);
        setTimeout(() => {
            this.createChatInteraction(this.getNextConversation(conversation.options[key]), true);
        }, 1000);
    }

    /**
     * Retrieve the next conversation.
     *
     * @param conversation
     * @returns
     */
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

    /**
     * Adds an event listener that waits for new conversation to appear.
     *
     * @param conversation
     */
    protected waitForNextConversation(conversation: any): void {
        this.fakeOS.addEventListener(PhoneEvents.NewConversation, () => {
            this.createChatInteraction(this.getNextConversation(conversation), true);
        }, true);
    }

    /**
     * Adds an event listener that waits for the options to show.
     *
     * @param conversation
     */
    protected waitForShowOptions(conversation: any): void {
        this.fakeOS.addEventListener(PhoneEvents.ShowOptions, () => {
            this.showOptions(conversation);
        }, true);
    }

    /**
     * Saves the current state of the chat.
     *
     * @param conversation
     */
    protected saveChatRegistry(conversation: any): void {
        this.fakeOS.log("Saving " + this.chat[this.activeContact].id + " last conversation as " + conversation.id);
        let chatRegistry = this.fakeOS.registry.get('chat');
        chatRegistry[this.chat[this.activeContact].id+'_lastchat'] = conversation.id;
        this.fakeOS.addData('chat', chatRegistry);
    }

    /**
     * @inheritdoc
     */
    public checkNewElements(type: string) {
        let complete = Object.keys(this.fakeOS.registry.get('complete'));
        let notifications = this.fakeOS.registry.get('notifications');
        let content = this.fakeOS.cache.json.get(type);

        let items = [];

        if (content !== undefined) {
            for (let element in content) {
                // If already completed or already in notifications, skip the element.
                if(complete.includes(content[element]['id']) || notifications.find((o:any) => o.id == content[element]['id'])) {
                    this.fakeOS.log('Skipping notification ' + content[element]['id']);
                    continue;
                }

                let first = true;
                for (let conversation in content[element]['conversation']) {

                    if(complete.includes(content[element]['conversation'][conversation]['id']) || notifications.find((o:any) => o.id == content[element]['conversation'][conversation]['id'])) {
                        this.fakeOS.log('Skipping notification ' + content[element]['id']);
                        first = false;
                        continue;
                    }

                    if(content[element]['lastMessage'] !== undefined) {
                        if(content[element]['conversation'][conversation]['id'] <= content[element]['lastMessage']) {
                            this.fakeOS.log('Skipping notification (<lastMessage) ' + content[element]['id']);
                            continue;
                        }
                    }

                    let conditions = content[element]['conversation'][conversation]['condition'];

                    // Only notify the first chat without conditions
                    if (!first && conditions === null) {
                        continue;
                    }

                    if(this.fakeOS.checkDone(conditions)) {
                        items.push({
                            id: content[element]['conversation'][conversation]['id'],
                            title: content[element]['conversation'][conversation]['text'],
                            type: type,
                            contact: content[element]['id']
                        });
                    }

                    first = false;
                }
            }
        }

        return items;
    }
}