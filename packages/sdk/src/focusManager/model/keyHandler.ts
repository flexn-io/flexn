import { TVEventHandler, NativeModules, NativeEventEmitter, DeviceEventEmitter } from 'react-native';
import { isPlatformAndroidtv, isPlatformTvos, isPlatformFiretv } from '@rnv/renative';
import throttle from 'lodash.throttle';
import CoreManager from './core';
import { DIRECTION } from '../constants';
import Logger from './logger';

const EVENT_KEY_ACTION_UP = 'up';
const EVENT_KEY_ACTION_DOWN = 'down';
const EVENT_KEY_ACTION_LONG_PRESS = 'longPress';

// const INTERVAL_TIME_MS = 100;
const INTERVAL_TIME_MS = 50;
const SCROLL_INDEX_INTERVAL_ROW = 3;
const SCROLL_INDEX_INTERVAL_GRID = 1;
const SCROLL_INDEX_INTERVAL_LIST = 1;
// const MIN_VERTICAL_SCROLLING = 50;

const EVENT_TYPE_SELECT = 'select';
const EVENT_TYPE_RIGHT = 'right';
const EVENT_TYPE_LEFT = 'left';
const EVENT_TYPE_DOWN = 'down';
const EVENT_TYPE_UP = 'up';

const IS_ANDROID_BASED = isPlatformAndroidtv || isPlatformFiretv;

class KeyHandler {
    private selectHandler: any;
    private eventEmitter: any;

    private _longPressInterval: any;
    private _stopKeyDownEvents: boolean;

    constructor() {
        this._stopKeyDownEvents = false;
        this._longPressInterval = 0;

        const { TvRemoteHandler } = NativeModules;

        if (isPlatformTvos) {
            this.eventEmitter = new NativeEventEmitter(TvRemoteHandler);
        } else {
            this.eventEmitter = DeviceEventEmitter;
        }

        this.selectHandler = new TVEventHandler();

        this.onKeyDown = throttle(this.onKeyDown.bind(this), 100);
        this.onKeyLongPress = this.onKeyLongPress.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.handleKeyEvent = this.handleKeyEvent.bind(this);
        this.enableKeyHandler = this.enableKeyHandler.bind(this);

        this.enableKeyHandler();
        this.enableSelectHandler();
    }

    public removeListeners() {
        if (isPlatformTvos) {
            this.eventEmitter.removeListener('onTVRemoteKey', this.handleKeyEvent);
        }
        if (IS_ANDROID_BASED) {
            this.eventEmitter.remove();
        }
    }

    private enableKeyHandler() {
        if (isPlatformTvos) {
            this.eventEmitter.addListener('onTVRemoteKey', this.handleKeyEvent);
        } else {
            this.eventEmitter = DeviceEventEmitter.addListener('onTVRemoteKey', this.handleKeyEvent);
        }
    }

    private enableSelectHandler() {
        this.selectHandler.enable(null, (_: any, evt: any) => {
            const direction = evt.eventType;
            if (isPlatformTvos) {
                if (direction === 'playPause') {
                    Logger.getInstance().debug(CoreManager);
                    CoreManager.debuggerEnabled = !CoreManager.isDebuggerEnabled;
                }

                if (direction === 'select') {
                    // This can happen if we opened new screen which doesn't have any focusable
                    // then last screen in context map still keeping focus
                    const currentFocus = CoreManager.getCurrentFocus();
                    if (currentFocus && currentFocus?.getScreen()?.isInForeground()) {
                        currentFocus.onPress();
                    }
                }
            }
        });
    }

    private handleKeyEvent({ eventKeyAction, eventType }: { eventKeyAction: string; eventType: string }) {
        switch (eventKeyAction) {
            case EVENT_KEY_ACTION_UP:
                return this.onKeyUp(eventType);
            case EVENT_KEY_ACTION_DOWN:
                return this.onKeyDown(eventType);
            case EVENT_KEY_ACTION_LONG_PRESS:
                return this.onKeyLongPress(eventType);
            default:
                break;
        }
    }

    private onKeyDown(eventType: string) {
        if (eventType === 'playPause') {
            Logger.getInstance().debug(CoreManager);
            CoreManager.debuggerEnabled = !CoreManager.isDebuggerEnabled;
        }

        if (!this._stopKeyDownEvents) {
            if (IS_ANDROID_BASED && eventType === EVENT_TYPE_SELECT && CoreManager.getCurrentFocus()) {
                CoreManager.getCurrentFocus()?.onPress();
            }

            if (CoreManager.getCurrentFocus()) {
                if (CoreManager.hasPendingUpdateGuideLines) {
                    CoreManager.executeUpdateGuideLines();
                }

                if (DIRECTION.includes(eventType)) {
                    CoreManager.executeDirectionalFocus(eventType);
                    CoreManager.executeScroll(eventType);
                    CoreManager.executeUpdateGuideLines();
                }
            }
        }
    }

    private onKeyLongPress(eventType: string) {
        if (this.isInRecycler()) {
            if (!this.isNested()) {
                if (this.isHorizontal() && [EVENT_TYPE_DOWN, EVENT_TYPE_UP].includes(eventType)) {
                    this._stopKeyDownEvents = false;
                    return;
                }

                if (!this.isHorizontal() && [EVENT_TYPE_LEFT, EVENT_TYPE_RIGHT].includes(eventType)) {
                    this._stopKeyDownEvents = false;
                    return;
                }
            }

            this._stopKeyDownEvents = true;
            let selectedIndex = this.getSelectedIndex();
            this._longPressInterval = setInterval(() => {
                if (EVENT_TYPE_RIGHT === eventType) {
                    selectedIndex += SCROLL_INDEX_INTERVAL_ROW;
                    if (selectedIndex > this.getMaxIndex()) selectedIndex = this.getMaxIndex();
                }
                if (EVENT_TYPE_LEFT === eventType) {
                    selectedIndex -= SCROLL_INDEX_INTERVAL_ROW;
                    if (selectedIndex < 0) selectedIndex = 0;
                }

                if (EVENT_TYPE_UP === eventType) {
                    selectedIndex -= this.isNested() ? SCROLL_INDEX_INTERVAL_LIST : SCROLL_INDEX_INTERVAL_GRID;
                    if (selectedIndex < 0) selectedIndex = 0;
                }

                if (EVENT_TYPE_DOWN === eventType) {
                    selectedIndex += this.isNested() ? SCROLL_INDEX_INTERVAL_LIST : SCROLL_INDEX_INTERVAL_GRID;
                    if (selectedIndex > this.getMaxIndex(true)) selectedIndex = this.getMaxIndex(true);
                }

                CoreManager.executeInlineFocus(selectedIndex, eventType);
                CoreManager.executeUpdateGuideLines();

                if (selectedIndex === 0 || selectedIndex === this.getMaxIndex(EVENT_TYPE_DOWN === eventType)) {
                    clearInterval(this._longPressInterval);
                    this._stopKeyDownEvents = false;
                }
            }, INTERVAL_TIME_MS);
        }
    }

    private onKeyUp(eventType: string) {
        this._stopKeyDownEvents = false;
        if (this._longPressInterval) {
            clearInterval(this._longPressInterval);
            this._longPressInterval = 0;
            setTimeout(() => {
                this.onKeyDown(eventType);
            }, 100);
        }
    }

    private getSelectedIndex(): number {
        const currentFocus = CoreManager.getCurrentFocus();

        if (currentFocus) {
            return currentFocus.getRepeatContext()?.index || 0;
        }

        return 0;
    }

    private getMaxIndex(vertical = false): number {
        let parent = CoreManager.getCurrentFocus()?.getParent();
        if (this.isNested() && vertical) {
            parent = parent?.getParent();
        }
        if (parent) {
            return parent.getLayouts().length;
        }

        return 0;
    }

    private isInRecycler(): boolean {
        const parent = CoreManager.getCurrentFocus()?.getParent();

        return parent?.isRecyclable() ? true : false;
    }

    private isHorizontal(): boolean {
        const parent = CoreManager.getCurrentFocus()?.getParent();

        return parent?.isRecyclable() && parent?.isHorizontal() ? true : false;
    }

    private isNested(): boolean {
        const parent = CoreManager.getCurrentFocus()?.getParent();

        return parent?.isRecyclable() && parent?.isNested() ? true : false;
    }
}

export default KeyHandler;
