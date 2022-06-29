import AbstractRunner from './AbstractRunner';

class MacosElectronRunner extends AbstractRunner {
    launchApp = () => {
        // do nothing
    };

    getElementById = (selector: string) => {
        return $(`[data-testid="${selector}"]`);
    };

    getElementByText = (selector: string) => {
        return $(`div=${selector}`);
    };

    scrollById = async (selector: string) => {
        await (await this.getElementById(selector)).scrollIntoView();
    };

    clickById = async (selector: string) => {
        await (await this.getElementById(selector)).click();
    };

    clickByText = async (selector: string) => {
        await (await this.getElementByText(selector)).click();
    };

    pressButtonHome = () => {
        // do nothing
    };

    pressButtonBack = () => {
        // do nothing
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

export default MacosElectronRunner;
