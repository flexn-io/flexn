const FlexnRunner = require('@flexn/graybox').default;

describe('Test template', () => {
    before(() => {
        FlexnRunner.launchApp();
    });

    it('--> check if elements are displayed in Home Page', async () => {
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-flexn-image');
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-welcome-message-text');
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-version-number-text');
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-try-me-button');
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-now-try-me-button');
    });

    it('--> check if Carousels Page opens when "Carousels" button is selected', async () => {
        await FlexnRunner.waitForDisplayedById('template-home-screen-flexn-image');
        if (process.env.PLATFORM === 'android' || process.env.PLATFORM === 'ios') {
            await FlexnRunner.clickById('template-menu-drawer-button');
        }
        await FlexnRunner.clickById('template-menu-carousels-button');
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-carousels-screen-container');
        if (process.env.PLATFORM === 'android' || process.env.PLATFORM === 'ios') {
            await FlexnRunner.clickById('template-menu-drawer-button');
        }
        await FlexnRunner.clickById('template-menu-home-button');
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.pressButtonUp(1);
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-flexn-image');
    });

    it('--> check if My Modal opens when "My Modal" button is selected', async () => {
        await FlexnRunner.waitForDisplayedById('template-home-screen-flexn-image');
        if (process.env.PLATFORM === 'android' || process.env.PLATFORM === 'ios') {
            await FlexnRunner.clickById('template-menu-drawer-button');
        }
        await FlexnRunner.clickById('template-menu-my-modal-button');
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.pressButtonDown(2);
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-modal-screen-container');
        await FlexnRunner.clickById('template-modal-screen-close-button');
        if (process.env.PLATFORM === 'android' || process.env.PLATFORM === 'ios') {
            await FlexnRunner.waitForDisplayedById('template-menu-home-button');
            await FlexnRunner.clickById('template-menu-home-button');
        }
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-flexn-image');
    });

    it('--> check if Carousels Page opens when "Now Try Me!" button is selected', async () => {
        await FlexnRunner.waitForDisplayedById('template-home-screen-flexn-image');
        await FlexnRunner.clickById('template-home-screen-now-try-me-button');
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-carousels-screen-container');
        if (process.env.PLATFORM === 'android' || process.env.PLATFORM === 'ios') {
            await FlexnRunner.clickById('template-menu-drawer-button');
        }
        await FlexnRunner.clickById('template-menu-home-button');
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.pressButtonUp(2);
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-flexn-image');
    });
});