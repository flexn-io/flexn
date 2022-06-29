import AbstractRunner from './AbstractRunner';
import { pressButtonAndroid } from './helpers';

class AndroidRunner extends AbstractRunner {
    launchApp = () => {
        // do nothing
    };

    getElementById = (selector: string) => {
        return $(`~${selector}`);
    };

    getElementByText = (selector: string) => {
        return $(`[text="${selector}"]`);
    };

    scrollById = async (selector: string) => {
        await browser.execute('mobile: scroll', { strategy: 'accessibility id', selector });
    };

    clickById = async (selector: string) => {
        await (await this.getElementById(selector)).click();
    };

    clickByText = async (selector: string) => {
        await (await this.getElementByText(selector)).click();
    };

    pressButtonHome = async (n: number) => {
        await pressButtonAndroid(n, 3);
    };

    pressButtonBack = async (n: number) => {
        await pressButtonAndroid(n, 4);
    };

    pressButtonUp = () => {
        // do nothing
    };

    pressButtonDown = () => {
        // do nothing
    };

    pressButtonLeft = () => {
        // do nothing
    };

    pressButtonRight = () => {
        // do nothing
    };

    pressButtonSelect = () => {
        // do nothing
    };

    expectToBeFocusedById = () => {
        // do nothing
    };

    expectToBeFocusedByText = () => {
        // do nothing
    };

    waitForFocusedById = () => {
        // do nothing
    };

    waitForFocusedByText = () => {
        // do nothing
    };
}

export default AndroidRunner;
