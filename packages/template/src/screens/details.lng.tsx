/* eslint-disable no-underscore-dangle */
import { Lightning, Router } from '@lightningjs/sdk';
import { getHexColor, LAYOUT, ROUTES } from '../config';
import { getRandomData } from '../utils';
import Button from '../components/button.lng';

export default class Details extends Lightning.Component {
    focusIndex = 0;

    static _template() {
        return {
            rect: true,
            color: getHexColor('#FFFFFF'),
            w: LAYOUT.w,
            h: LAYOUT.h,
            src: '',
            flex: { justifyContent: 'center', direction: 'column', alignItems: 'center' },
            Text: {
                text: { text: '' }
            },
            Button1: {
                type: Button,
                title: 'Go back',
                style: { y: 50 },
                opacity: 0,
                signals: {
                    onPress: '_onPressBtn1'
                }
            },
            Button2: {
                type: Button,
                title: 'Go to home',
                style: { y: 120 },
                opacity: 0,
                signals: {
                    onPress: '_onPressBtn2'
                }
            },
        };
    }

    set params(params) {
        const { backgroundImage, title } = getRandomData(params.row, 0, params.index);
        this.patch({
            src: backgroundImage,
            Text: { text: { text: title } }
        });
    }

    _construct() {
        this.focusIndex = 0;
    }

    _onPressBtn1() {
        Router.back();
    }    
    
    _onPressBtn2() {
        Router.navigate(ROUTES.HOME);
    }

    _handleUp() {
        if (this.focusIndex !== 0) {
            this.focusIndex--;
        }
    }
    
    _handleDown() {
        if (this.focusIndex !== 1) {
            this.focusIndex++;
        }
    }

    _getFocused() {
        return this.focusIndex === 0 ? this.tag('Button1') : this.tag('Button2');
    }
}