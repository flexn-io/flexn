const FlexnRunner = require('@flexn/graybox').default;

describe('Test Harness app', () => {
    before(() => {
        FlexnRunner.launchApp();
    });
    it('--> scroll to Rows button and expect Rows button to be displayed by text', async () => {
        await FlexnRunner.waitForDisplayedById('flexn-screens-home-test-case-list-button-0-0');
        if (process.env.PLATFORM === 'web' || process.env.PLATFORM === 'macos') {
            await FlexnRunner.scrollById('flexn-screens-home-test-case-list-button-1-0', 'down', 'flexn-screens-home-test-case-list-button-0-0');
        } else {
            await FlexnRunner.scrollById('flexn-screens-home-test-case-list-button-3-0', 'down');
            await FlexnRunner.pressButtonDown(17);
        }
        await FlexnRunner.expectToBeDisplayedByText('Rows');
    });
});
