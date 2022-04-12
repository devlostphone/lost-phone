import { FakeOS } from '/src/scenes/FakeOS';
import App from '/src/lib/apps/App';
import TextList from '../ui/gameObjects/list/TextList';
import { PhoneEvents } from '../events/GameEvents';
import SearchBox from '../ui/gameObjects/input/SearchBox';

/**
 * Browser app.
 */
 export default class BrowserApp extends App {

    protected pages: any;
    protected pageList?: TextList;
    protected isListOpen: boolean;
    protected searchBox: any;
    protected body?: any;

    /**
     * Class constructor.
     *
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.pages = this.fakeOS.cache.json.get('browser');
        this.isListOpen = false;
    }

    public render() {

        this.searchBox = new SearchBox(
            this.fakeOS,
            this.fakeOS.getActiveApp().area.width * 0.1,
            this.fakeOS.getActiveApp().area.height / 3,
            '',
            this.pages,
            { color: '0x000000', fontSize: '28px' }
        );
        this.addElements(this.searchBox);

        this.fakeOS.addInputEvent('pointerup', () => {
            if (!this.isListOpen) {
                this.showPageList();
            } else {
                this.pageList?.destroy();
                this.body?.setVisible(true);
                this.isListOpen = false;
            }
        }, this.searchBox.background);

        // Open page when link selected
        this.fakeOS.addEventListener(PhoneEvents.ItemSelected, (id: number) => {
            this.showPage(id);
            this.pageList?.destroy();
            this.isListOpen = false;
        });
    }

    protected showPageList(): void {

        this.pageList = new TextList(this.fakeOS, 0, 0);
        for (let i = 0; i < this.pages.length; i++) {
            this.pageList.addItem(
                this.pages[i]['id'],
                this.pages[i]['title'],
                !this.fakeOS.checkDone(this.pages[i]['condition'])
            );
        }

        this.fakeOS.add.tween({
            targets: this.searchBox,
            y: this.area.y,
            duration: 200,
            onComplete: () => {
                this.isListOpen = true;
                this.body?.setVisible(false);
                this.addRow(this.pageList, { y: 1 });
            }
        });
    }

    protected showPage(id: number): void {
        this.getActiveLayer().setHandler(() => {
            this.body?.destroy();
            this.reRender();
        });
        this.addLayer(0x333333);
        this.addElements(this.searchBox);

        const page = this.pages.find((element: any) => element.id == id);
        this.searchBox.addText(page['title']);

        if ('body' in page) {
            this.body = this.fakeOS.add.text(
                0, this.area.y,
                page['body'],
                { fontSize: "28px", wordWrap: { width: this.area.width * 0.85, useAdvancedWrap: true} }
            );

        } else {
            this.body = this.fakeOS.add.dom(0, 0).createFromHTML(
                '<iframe width="'+ (this.area.width - 6) +'" height="'+ this.rowHeight() * 9 +'" src="'+ page['page'] +'" />'
            );
        }

        this.addRow(this.body, { y: 2, position: Phaser.Display.Align.TOP_CENTER });
        this.getActiveLayer().setHandler(() => {
            this.reRender();
        });
    }
}