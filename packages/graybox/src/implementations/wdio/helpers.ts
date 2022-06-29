/* eslint-disable no-await-in-loop */
const pressButtonAndroid = async (n: number, keyCode: number) => {
    for (let i = 0; i < n; i++) {
        await driver.pressKeyCode(keyCode);
        await browser.pause(500);
    }
};

const pressButtonIos = async (n: number, name: string) => {
    for (let i = 0; i < n; i++) {
        await browser.execute('mobile: pressButton', { name });
        await browser.pause(500);
    }
};

export { pressButtonAndroid, pressButtonIos };
