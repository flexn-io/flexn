import AbstractRunner from './AbstractRunner';

class MacosRunner extends AbstractRunner {
    launchApp = () => {
        // do nothing
    };

    getElementById = (selector: string) => {
        return $(`~${selector}`);
    };

    getElementByText = (selector: string) => {
        return $(`[name="${selector}"]`);
    };

    scrollById = async (selectorTo: string, direction: string, selectorFrom: string) => {
        const elementFrom = await this.getElementById(selectorFrom);
        const elementTo = await this.getElementById(selectorTo);
        const frameFrom = await elementFrom.getAttribute('frame') as unknown as {x: number, y: number, width: number, height: number};
        const frameTo = await elementTo.getAttribute('frame') as unknown as {x: number, y: number, width: number, height: number};
        const scrollX = frameFrom.x - frameTo.x;    
        const scrollY = frameFrom.y - frameTo.y;
        await browser.execute('macos: scroll', { elementId: elementFrom, deltaX: scrollX, deltaY: scrollY });        
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

export default MacosRunner;
