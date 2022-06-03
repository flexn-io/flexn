import Lightning from '@lightningjs/core';

export default class ActivityIndicator extends Lightning.Component {
    static _template() {
        return {
            rect: true,
            w: 0,
            h: 0,
            color: 0xffffffff,
        };
    }
}
