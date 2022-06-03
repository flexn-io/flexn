import { makeid } from '../helpers';
import AbstractFocusModel from './AbstractFocusModel';
import type { ScreenCls } from './screen';
import { alterForbiddenFocusDirections } from '../../focusManager/helpers';
import { ForbiddenFocusDirections } from '../types';

export class View extends AbstractFocusModel {
    private _type: string;

    public repeatContext?: {
        parentContext: AbstractFocusModel;
        index: number;
    };

    public _parent?: AbstractFocusModel;
    public _initialFocus?: AbstractFocusModel;
    public _screen?: ScreenCls;
    public _isFocused: boolean;
    public _forbiddenFocusDirections: ForbiddenFocusDirections[];

    public _repeatContext:
        | {
              parentContext: AbstractFocusModel;
              index: number;
          }
        | undefined;

    private _onFocus?: () => void;
    private _onBlur?: () => void;
    private _onPress?: () => void;

    constructor(params: any) {
        super();

        const { repeatContext, parent, forbiddenFocusDirections, onFocus, onBlur, onPress } = params;

        const id = makeid(8);
        this._id = parent?.id ? `${parent.id}:view-${id}` : `view-${id}`;
        this._type = 'view';
        this._parent = parent;
        this._isFocused = false;
        this._repeatContext = repeatContext;
        this._forbiddenFocusDirections = alterForbiddenFocusDirections(forbiddenFocusDirections);

        this._onFocus = onFocus;
        this._onBlur = onBlur;
        this._onPress = onPress;
    }

    public getType(): string {
        return this._type;
    }

    public destroy(): void {
        destroyInstance(this._id);
    }

    public isFocusable(): boolean {
        return true;
    }

    public updateEvents({ onPress, onFocus, onBlur }: any) {
        this._onPress = onPress;
        this._onFocus = onFocus;
        this._onBlur = onBlur;

        return this;
    }

    public setScreen(cls: ScreenCls): this {
        this.screen = cls;
        return this;
    }

    public getScreen(): ScreenCls | undefined {
        return this.screen;
    }

    public onFocus(): void {
        if (this._onFocus) {
            this._onFocus();
        }
    }

    public onBlur(): void {
        if (this._onBlur) {
            this._onBlur();
        }
    }

    public onPress(): void {
        if (this._onPress) {
            this._onPress();
        }
    }

    public setIsFocused(value: boolean): this {
        this._isFocused = value;

        return this;
    }

    public getIsFocused(): boolean {
        return this._isFocused;
    }

    public setRepeatContext(value: any): this {
        this._repeatContext = value;

        return this;
    }

    public getRepeatContext(): { parentContext: AbstractFocusModel; index: number } | undefined {
        return this._repeatContext;
    }

    public getParent(): AbstractFocusModel | undefined {
        return this._parent;
    }
}

const ViewInstances: { [key: string]: View } = {};
function createInstance(context: any) {
    const _View = new View(context);
    ViewInstances[_View.getId()] = _View;

    return ViewInstances[_View.getId()];
}

function destroyInstance(id: string) {
    if (ViewInstances[id]) {
        delete ViewInstances[id];
    }
}

export type ViewCls = View;

export { createInstance, destroyInstance };