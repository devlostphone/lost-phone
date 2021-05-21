import App from '~/lib/apps/App';
import {FakeOS} from '~/scenes/FakeOS';

export default class CalculatorApp extends App {

    constructor(scene: FakeOS) {
        super(scene);
    }

    preload() {
        console.log("CalculatorApp.preload()");
    }

    create() {
        console.log("CalculatorApp.create()");
    }

    public render() {
        console.log("Calculatorapp.render()");
    }

}
