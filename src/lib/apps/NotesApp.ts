import { FakeOS } from '../../scenes/FakeOS';
import App from '../../lib/apps/App';

/**
 * Notes app.
 */
export default class NotesApp extends App {

    protected notes: any;

    /**
     * Class constructor.
     *
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.notes = this.fakeOS.cache.json.get('notes');
    }

    /**
     * @inheritdoc
     */
    public render() {
        this.getActiveLayer().clear();
        this.setBackground();
        this.showHeader();
        this.listNotes();
    }

    /**
     * Shows the app title.
     */
    protected showHeader(): void {
        let container : Phaser.GameObjects.Container = this.fakeOS.add.container(0,0);
        let list : Phaser.GameObjects.Image = this.fakeOS.add.image(-this.fakeOS.getActiveApp().area.width / 2 + 32, 4, 'list-icon').setOrigin(0).setScale(1.25);
        let title = this.fakeOS.add.text(-this.fakeOS.getActiveApp().area.width / 2 + 300, -8, "Notes", {
            fontSize: "48px",
            align: "center",
            color: '#efefef',
            fontFamily: 'Roboto-Bold'
        }).setOrigin(0);
        let search = this.fakeOS.add.image(-this.fakeOS.getActiveApp().area.width / 2 + 564, 4, 'search-icon').setOrigin(0);
        let write = this.fakeOS.add.image(-this.fakeOS.getActiveApp().area.width / 2 + 640, 4, 'write-icon').setOrigin(0);
        let line = this.fakeOS.add.line(
            0,0,
            0,48,
            this.fakeOS.getActiveApp().area.width,48
        ).setStrokeStyle(100, 0x6f6f6f);

        container.add([list, title, search, write, line]);
        this.addRow(container);
    }

    /**
     * Shows list all notes
     */
    protected listNotes(): void {
        for (let i=0; i < this.notes.length; i++) {

            let note = this.fakeOS.add.container(0, 0);
            {
                // set setSize container is mandatory in related to get interaction
                note.setSize(
                    this.fakeOS.getActiveApp().area.width,
                    this.fakeOS.getActiveApp().rowHeight()
                );

                let entryNote = this.fakeOS.add.rectangle(
                    0, 0, // x, y
                    this.fakeOS.getActiveApp().area.width - 32, 128, // width, height
                    0xffffff);
                entryNote.setStrokeStyle(2, 0xffffff);
                entryNote.setAlpha(0.666);

                let titleNote = this.fakeOS.add.text(
                    -this.fakeOS.getActiveApp().area.width / 2 + 32, -48,
                    this.notes[i].title,
                    {
                        fontSize: "28px",
                        align: "left",
                        color: '#1c1c1c',
                        fontFamily: 'Roboto-Bold'
                    }
                );

                let dateNote = this.fakeOS.add.text(
                    -this.fakeOS.getActiveApp().area.width / 2 + 32, -16,
                    this.notes[i].date,
                    {
                        fontSize: "28px",
                        align: "left",
                        color: '#1c1c1c',
                        fontFamily: 'Roboto'
                    }
                );

                note.add([entryNote, titleNote, dateNote]);
            }

            // Add note interaction
            this.fakeOS.addInputEvent(
                'pointerup',
                () => {
                    this.openNote(this.notes[i]);
                },
                note
            );
            this.fakeOS.addInputEvent(
                'pointerover',
                () => {
                    note.getFirst().setAlpha(1);
                },
                note
            );

            this.fakeOS.addInputEvent(
                'pointerout',
                () => {
                    note.getFirst().setAlpha(0.666);
                },
                note
            );

            // Add note to row grid
            this.addRow(note, {offsetY : 32});
        }
    }

    /**
     * Display note's content
     */
    protected openNote(note : any): void {
        this.addLayer();
        let container = this.fakeOS.add.container(0, 0);
        {
            // set setSize container is mandatory in related to get interaction
            container.setSize(
                this.fakeOS.getActiveApp().area.width,
                this.fakeOS.getActiveApp().rowHeight()
            );
            let aNote = this.fakeOS.add.rexBBCodeText(
                32, 56,
                "[b]" + note.title + "[/b]\n[size=30]" + note.date + "[/size]" + "[/b]\n[size=24]" + note.body + "[/size]",
                {
                    fontSize: "42px",
                    align: "left",
                    color: '#fff',
                    fontFamily: 'Roboto',
                    wordWrap: {
                        width: this.fakeOS.getActiveApp().area.width - 64,
                        useAdvancedWrap: true
                    },
                }
            );
            container.add(aNote);
        }

        this.getActiveLayer().add(container);
    }

    /**
     * Set app background
     */
    protected setBackground(image?: string): void {
        if (image !== undefined) {
            this.fakeOS.UI.setBackground(image);
        } else {
            let background = this.fakeOS.cache.json.get('apps').find(app => app.key == 'NotesApp').background;
            this.fakeOS.UI.setBackground(background);
        }
    }
}
