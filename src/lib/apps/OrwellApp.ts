import { FakeOS } from '../../scenes/FakeOS';
import GalleryApp from './GalleryApp';

/**
 * Orwell Browser App based on Gallery App
 */
export default class OrwellApp extends GalleryApp {

    /**
     * Class constructor.
     *
     * @param fakeOS
     */
    public constructor(fakeOS: FakeOS) {
        super(fakeOS);
        this.media = this.fakeOS.cache.json.get('orwell');
    }
}
