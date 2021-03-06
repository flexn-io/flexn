/* eslint-disable no-underscore-dangle */
import { Lightning, Utils, Router } from '@lightningjs/sdk';
import { LAYOUT, THEME_LIGHT, THEME } from '../config';
import { getHexColor } from '../utils';

export default class Modal extends Lightning.Component {
    static _template() {
        return {
            rect: true,
            w: LAYOUT.w,
            h: LAYOUT.h,
            color: getHexColor('#FFFFFF'),
            Close: {
                w: 40,
                h: 40,
                x: (x) => x - 90,
                y: 50,
                src: Utils.asset('close-90.png'),
            },
            Text: {
                x: LAYOUT.w / 2,
                y: LAYOUT.h / 2,
                mount: 0.5,
                text: {
                    text: 'This is my Modal!',
                    textColor: getHexColor('#000000'),
                    fontFace: THEME.light.primaryFontFamily,
                },
            },
        };
    }

    _init() {
        const color = window.theme === THEME_LIGHT ? getHexColor('#FFFFFF') : getHexColor('#000000');
        const textColor = window.theme === THEME_LIGHT ? getHexColor('#000000') : getHexColor('#FFFFFF');
        this.patch({ color, Text: { text: { textColor } } });
    }

    _getFocused() {
        this.tag('Close');
    }

    _focus() {
        this.tag('Close').patch({ smooth: { scale: 1.2 } });
    }

    _handleEnter() {
        Router.back();
    }
}
