// this file is only for internal test functionality testing
const FlexnRunner = require('@flexn/graybox').default;

describe('Test template', () => {
    before(() => {
        FlexnRunner.launchApp();
    });
    it('pause for 30s', async () => {
        await FlexnRunner.pause(30000);
    });
    it('test focus', async () => {
        await FlexnRunner.waitForFocusedById('template-screen-home-now-try-me-button');
        await FlexnRunner.expectToBeFocusedById('template-screen-home-now-try-me-button');
    });
});