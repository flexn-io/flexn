/**
 * Copyright 2021 Comcast Cable Communications Management, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import FocusManager from '../FocusManager';
//  import { getY, getW } from '../../utils';
import { debounce } from 'debounce';
import { getY, getW } from '@lightningjs/ui-components/utils';

export default class Column extends FocusManager {
    static _template() {
        return {
            ...super._template(),
            direction: 'column',
        };
    }

    _construct() {
        super._construct();
        this._smooth = false;
        this._independentNavigation = false;
        this._itemSpacing = 0;
        this._itemPosX = 0;
        this._itemPosY = 0;
        this._scrollIndex = 0;
        this._whenEnabled = new Promise((resolve) => (this._firstEnable = resolve));
        this.debounceDelay = Number.isInteger(this.debounceDelay) ? this.debounceDelay : 30;
        this._update = debounce(this._updateLayout, this.debounceDelay);
        this._updateImmediate = debounce(this._updateLayout, this.debounceDelay, true);
    }

    _init() {
        super._init();
        if (!this.h) {
            // if height is undefinend or 0, set the Columns's height
            this.h =
                this.parent && // if the Column is a child item in a FocusManager (like Row)
                this.parent.parent &&
                this.parent.parent instanceof FocusManager
                    ? this.parent.parent.h
                    : this.stage.h;
        }
    }

    get _itemTransition() {
        return (
            this.itemTransition || {
                duration: 0.4,
                timingFunction: 'cubic-bezier(0.20, 1.00, 0.30, 1.00)',
            }
        );
    }

    _focus() {
        this.items.forEach((item) => (item.parentFocus = true));
    }

    _unfocus() {
        this.items.forEach((item) => (item.parentFocus = false));
    }

    selectNext() {
        this._smooth = true;
        return super.selectNext();
    }

    selectPrevious() {
        this._smooth = true;
        return super.selectPrevious();
    }

    _shouldScroll() {
        let shouldScroll = this.alwaysScroll;
        if (!shouldScroll && !this.neverScroll) {
            const lastChild = this.Items.childList.last;
            shouldScroll = lastChild && (this.shouldScrollUp() || this.shouldScrollDown());
        }
        return shouldScroll;
    }

    // TODO: can be documented in API when lastScrollIndex is made public
    shouldScrollUp() {
        let shouldScroll = false;

        if (this._lastScrollIndex) {
            shouldScroll = this.selectedIndex < this._lastScrollIndex;
            if (this._prevLastScrollIndex !== undefined && this._prevLastScrollIndex !== this._lastScrollIndex) {
                shouldScroll = true;
            }
        } else {
            shouldScroll = this.selectedIndex >= this._scrollIndex;
        }

        return this._itemsY < 0 && shouldScroll;
    }

    // TODO: can be documented in API when lastScrollIndex is made public
    shouldScrollDown() {
        const lastChild = this.Items.childList.last;
        return (
            this.selectedIndex > this._scrollIndex &&
            // end of Items container < end of last item
            Math.abs(this._itemsY - this.h) < lastChild.y + this.Items.childList.last.h
        );
    }

    render(next, prev) {
        this._prevLastScrollIndex = this._lastScrollIndex;

        if (
            this.plinko &&
            prev &&
            (prev.currentItem || prev.selected) &&
            !(this.items.indexOf(prev) === 0 && prev.skipPlinko)
        ) {
            const prevPlinko = this.checkSkipPlinko(prev, next);
            next.selectedIndex = this._getIndexOfItemNear(next, prevPlinko || prev);
        } else if (next && !next.selectedIndex) {
            next.selectedIndex = 0;
        }

        this._performRender();
    }

    checkSkipPlinko(prev, next) {
        // If previous doesn't have skip plinko or previous is the first or last item
        if (!prev || !prev.skipPlinko || [0, this.items.length - 1].includes(this.items.indexOf(prev))) {
            return null;
        }

        const prevIndex = this.items.indexOf(prev);
        const direction = prevIndex - this.items.indexOf(next);
        const up = direction > 0;

        // Grab all items below prev if up or all items before prev if down
        let prevItems = null;
        if (up) {
            prevItems = this.items.slice(prevIndex).map((i) => ({
                skipPlinko: i.skipPlinko,
                index: this.items.indexOf(i),
            }));
        } else {
            prevItems = this.items
                .slice(0, prevIndex + 1)
                .map((i) => ({
                    skipPlinko: i.skipPlinko,
                    index: this.items.indexOf(i),
                }))
                .reverse();
        }

        // first item that has skipPlinko but the previous does not
        // Start at the index prev
        const endOfMultiSkipPlinkos = prevItems.find(
            (i) => i.skipPlinko && !this.items[i.index + direction].skipPlinko
        );
        const prevPlinkoIndex = endOfMultiSkipPlinkos ? endOfMultiSkipPlinkos.index + direction : prevIndex + direction; // +/- 1, item index before prev

        return this.items[prevPlinkoIndex];
    }

    _performRender() {
        this._whenEnabled.then(() => {
            if (!this.Items.children.length) {
                if (this._smooth) {
                    this.Items.smooth = { y: this.itemPosY };
                } else {
                    this.Items.y = this.itemPosY;
                }
            } else if (this._shouldScroll()) {
                let scrollItem =
                    this.selectedIndex > this._lastScrollIndex
                        ? this.Items.children[this._lastScrollIndex - this._scrollIndex]
                        : this.selected;
                if (this.Items.children[this._firstFocusableIndex()] === scrollItem) {
                    scrollItem = this.Items.children[0];
                }
                const scrollOffset = (this.Items.children[this._scrollIndex] || { y: 0 }).y;
                if (this._smooth) {
                    const firstChild = this.Items.childList.first;
                    this.Items.smooth = {
                        y: [
                            -(scrollItem || firstChild).transition('y').targetValue +
                                (scrollItem === this.selected ? scrollOffset : 0),
                            this._itemTransition,
                        ],
                    };
                } else {
                    this.Items.patch({
                        y: -scrollItem.y + (scrollItem === this.selected ? scrollOffset : 0),
                    });
                }
            }

            this.onScreenEffect(this.onScreenItems);
        });
    }

    get onScreenItems() {
        return this.Items.children.filter((child) => this._isOnScreen(child));
    }

    _isOnScreen(child) {
        if (!child) return false;
        const y = getY(child);
        if (!Number.isFinite(y)) return false;
        // to calculate the target absolute Y position of the item, we need to use
        // 1) the entire column's absolute position,
        // 2) the target animation value of the items container, and
        // 3) the target value of the item itself
        const ItemY = this.core.renderContext.py + this.Items.transition('y').targetValue + y;
        const { h } = child;

        // check that the child is inside the bounds of the stage
        const withinTopStageBounds = ItemY + h > 0;
        // stage height needs to be adjusted with precision since all other values assume the original height and width (pre-scaling)
        const withinBottomStageBounds = ItemY < this.stage.h / this.stage.getRenderPrecision();

        // check that the child is inside the bounds of any clipping
        let withinTopClippingBounds = true;
        let withinBottomClippingBounds = true;
        if (this.core._scissor && this.core._scissor.length) {
            // _scissor consists of [ left position (x), top position (y), width, height ]
            const topBounds = this.core._scissor[1];
            const bottomBounds = topBounds + this.core._scissor[3];
            withinTopClippingBounds = Math.round(ItemY + h) > Math.round(topBounds);
            withinBottomClippingBounds = Math.round(ItemY) < Math.round(bottomBounds);
        }

        return withinTopStageBounds && withinBottomStageBounds && withinTopClippingBounds && withinBottomClippingBounds;
    }

    _updateLayout() {
        this._whenEnabled.then(() => {
            let nextY = 0;
            let nextW = 0;
            // layout items in row
            for (let i = 0; i < this.Items.children.length; i++) {
                const child = this.Items.children[i];
                nextW = Math.max(nextW, getW(child));
                if (this._smooth) {
                    child.smooth = { y: [nextY, this._itemTransition] };
                } else {
                    child.patch({ y: nextY });
                }
                nextY += child.h;
                if (i < this.Items.children.length - 1) {
                    nextY += this.itemSpacing;
                }

                if (child.centerInParent) {
                    // if the child is another focus manager, check the width of the item container
                    const childWidth = (child.Items && child.Items.w) || child.w;
                    // only center the child if it is within the bounds of this focus manager
                    if (childWidth < this.w) {
                        child.x = (this.w - childWidth) / 2;
                    }
                }
            }
            this.Items.patch({ w: nextW, h: nextY });

            const lastChild = this.Items.childList.last;
            const endOfLastChild = lastChild ? getY(lastChild) + lastChild.h : 0;
            const scrollOffset = (this.Items.children[this._scrollIndex] || { y: 0 }).y;

            // determine when to stop scrolling down
            if (this.alwaysScroll) {
                this._lastScrollIndex = this.Items.children.length - 1;
            } else if (endOfLastChild > this.h) {
                for (let i = this.Items.children.length - 1; i >= 0; i--) {
                    const child = this.Items.children[i];
                    const childY = getY(child);
                    if (childY + this.h - scrollOffset > endOfLastChild) {
                        this._lastScrollIndex = i;
                    } else {
                        break;
                    }
                }
            } else if (this._lastScrollIndex > this.items.length) {
                this._lastScrollIndex = this.items.length - 1;
            }

            this._performRender();
        });
    }

    get independentNavigation() {
        return this._independentNavigation;
    }

    set independentNavigation(value) {
        if (value !== this._independentNavigation) {
            this._independentNavigation = value;
        }
    }

    get itemSpacing() {
        return this._itemSpacing;
    }

    set itemSpacing(itemSpacing) {
        if (itemSpacing !== this._itemSpacing) {
            this._itemSpacing = itemSpacing;
            this._update();
        }
    }

    get scrollIndex() {
        return this._scrollIndex;
    }

    set scrollIndex(scrollIndex) {
        if (scrollIndex !== this._scrollIndex) {
            this._scrollIndex = scrollIndex;
            this._update();
        }
    }

    set itemPosX(x) {
        this.Items.x = this._itemPosX = x;
    }

    get itemPosX() {
        return this._itemPosX;
    }

    set itemPosY(y) {
        this.Items.y = this._itemPosY = y;
    }

    get itemPosY() {
        return this._itemPosY;
    }

    get _itemsY() {
        return getY(this.Items);
    }

    appendItems(items = []) {
        const itemWidth = this.renderWidth;
        this._smooth = false;

        items.forEach((item) => {
            item.parentFocus = this.hasFocus();
            item = this.Items.childList.a(item);
            item.w = getW(item) || itemWidth;
        });
        this.stage.update();
        this._updateLayout();
        this._update.clear();
        this._refocus();
    }

    setParentToItems() {
        this.Items.childList.forEach((ch) => {
            ch.parentColumn = this;
        });
    }

    scrollTo(index, duration = this._itemTransition.duration * 100) {
        if (duration === 0) {
            this.selectedIndex = index;
            return;
        }

        for (let i = 0; i !== Math.abs(this.selectedIndex - index); i++) {
            setTimeout(() => {
                if (this.selectedIndex > index) {
                    this.selectPrevious();
                } else {
                    this.selectNext();
                }
            }, duration * i);
        }
        this.Items.transition('y').on('finish', () => (this._smooth = false));
    }

    $itemChanged() {
        this._updateImmediate();
    }

    $removeItem(item) {
        if (item) {
            const wasSelected = item === this.selected;
            this.Items.childList.remove(item);
            this._updateImmediate();

            if (wasSelected || this.selectedIndex >= this.items.length) {
                this.selectedIndex = this._selectedIndex;
            }

            if (!this.items.length) {
                this.fireAncestors('$columnEmpty');
            }
        }
    }

    $columnChanged() {
        this._updateImmediate();
    }

    // can be overridden
    onScreenEffect() {
        // Override
    }
}
