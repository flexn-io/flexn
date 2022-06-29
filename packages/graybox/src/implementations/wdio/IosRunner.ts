/* eslint-disable no-await-in-loop */
import AbstractRunner from './AbstractRunner';
import { pressButtonIos } from './helpers';

class IosRunner extends AbstractRunner {
    launchApp = () => {
        // do nothing
    };

    getElementById = (selector: string) => {
        return $(`~${selector}`);
    };

    getElementByText = (selector: string) => {
        return $(`[label="${selector}"]`);
    };

    scrollById = async (selector: string, direction: string) => {
        const element = await this.getElementById(selector);
        let isDisplayed = await element.isDisplayed();
        while (!isDisplayed) {
            await browser.execute('mobile: scroll', { direction });
            isDisplayed = await element.isDisplayed();
        }
    };

    clickById = async (selector: string) => {
        await (await this.getElementById(selector)).click();
    };

    clickByText = async (selector: string) => {
        await (await this.getElementByText(selector)).click();
    };

    pressButtonHome = async (n: number) => {
        await pressButtonIos(n, 'home');
    };

    pressButtonBack = async (n: number) => {
        for (let i = 0; i < n; i++) {
            await browser.execute('mobile: dragFromToForDuration', {
                fromX: 10,
                fromY: 200,
                toX: 500,
                toY: 200,
                duration: 0.5,
            });
            await browser.pause(500);
        }
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

export default IosRunner;
