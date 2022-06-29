abstract class AbstractRunner {
    // launch app
    abstract launchApp(): void;

    // select
    abstract getElementById(selector: string): any;

    abstract getElementByText(selector: string): any;

    // scroll
    abstract scrollById(selectorTo: string, direction: string, selectorFrom: string): void;

    // click
    abstract clickById(selector: string): void;

    abstract clickByText(selector: string): void;

    // press button
    abstract pressButtonHome(n: number): void;

    abstract pressButtonBack(n: number): void;

    abstract pressButtonUp(n: number): void;

    abstract pressButtonDown(n: number): void;

    abstract pressButtonLeft(n: number): void;

    abstract pressButtonRight(n: number): void;

    abstract pressButtonSelect(n: number): void;

    // expect toBeExisting
    expectToBeExistingById = async (selector: string) => {
        const element = await this.getElementById(selector);
        if (element) {
            await expect(element).toBeExisting();
        }
    };

    expectToBeExistingByText = async (selector: string) => {
        const element = await this.getElementByText(selector);
        if (element) {
            await expect(element).toBeExisting();
        }
    };

    // expect toBeDisplayed
    expectToBeDisplayedById = async (selector: string) => {
        const element = await this.getElementById(selector);
        if (element) {
            await expect(element).toBeDisplayed();
        }
    };

    expectToBeDisplayedByText = async (selector: string) => {
        const element = await this.getElementByText(selector);
        if (element) {
            await expect(element).toBeDisplayed();
        }
    };

    // expect toBeClickable
    expectToBeClickableById = async (selector: string) => {
        const element = await this.getElementById(selector);
        if (element) {
            await expect(element).toBeClickable();
        }
    };

    expectToBeClickableByText = async (selector: string) => {
        const element = await this.getElementByText(selector);
        if (element) {
            await expect(element).toBeClickable();
        }
    };

    // waitForDisplayed
    waitForDisplayedById = async (selector: string, timeout = 60000) => {
        const element = await this.getElementById(selector);
        if (element) {
            await element.waitForDisplayed({ timeout });
        }
    };

    waitForDisplayedByText = async (selector: string, timeout = 60000) => {
        const element = await this.getElementByText(selector);
        if (element) {
            await element.waitForDisplayed({ timeout });
        }
    };

    // waitForExist
    waitForExistById = async (selector: string, timeout = 60000) => {
        const element = await this.getElementById(selector);
        if (element) {
            await element.waitForExist({ timeout });
        }
    };

    waitForExistByText = async (selector: string, timeout = 60000) => {
        const element = await this.getElementByText(selector);
        if (element) {
            await element.waitForExist({ timeout });
        }
    };

    // waitForClickable
    waitForClickableById = async (selector: string, timeout = 60000) => {
        const element = await this.getElementById(selector);
        if (element) {
            await element.waitForClickable({ timeout });
        }
    };

    waitForClickableByText = async (selector: string, timeout = 60000) => {
        const element = await this.getElementByText(selector);
        if (element) {
            await element.waitForClickable({ timeout });
        }
    };

    // setValue
    setValueById = async (selector: string, value: string) => {
        const element = await this.getElementById(selector);
        if (element) {
            await element.setValue(value);
        }
    };

    // clearValue
    clearValueById = async (selector: string) => {
        const element = await this.getElementById(selector);
        if (element) {
            await element.clearValue();
        }
    };

    // pause
    pause = async (time: number) => {
        await browser.pause(time);
    };

    // gherkin
    GIVEN = (message: string) => {
        //eslint-disable-next-line
        console.log(`GIVEN: ${message}`);
    };

    WHEN = (message: string) => {
        //eslint-disable-next-line
        console.log(`WHEN: ${message}`);
    };

    THEN = (message: string) => {
        //eslint-disable-next-line
        console.log(`THEN: ${message}`);
    };
}

export default AbstractRunner;
