import { Dimensions } from 'react-native';
import {
    DIRECTION_VERTICAL,
    DIRECTION_HORIZONTAL,
    CUTOFF_SIZE,
    VIEWPORT_PADDING,
    WINDOW_ALIGNMENT,
    DIRECTION_UP,
    DIRECTION_DOWN,
    DIRECTION_LEFT,
    DIRECTION_RIGHT,
} from './constants';
import logger from './logger';
import type { Context, ContextMap } from './types';
import { recalculateLayout } from './layoutManager';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const intersects = (guideLine: number, sizeOfCurrent: number, startOfNext: number, endOfNext: number) => {
    const a1 = guideLine - sizeOfCurrent * 0.5;
    const a2 = guideLine + sizeOfCurrent * 0.5;

    return (
        (a1 >= startOfNext && a1 <= endOfNext) ||
        (a2 >= startOfNext && a2 <= endOfNext) ||
        (a1 <= startOfNext && a2 >= endOfNext)
    );
};

const nextIsVisible = (nextMax: number, direction: string) => {
    if (DIRECTION_VERTICAL.includes(direction)) {
        return nextMax > 0 && nextMax <= windowWidth;
    }

    return true;
};

const intersectsOffset = (guideLine: number, startOfNext: number, endOfNext: number) =>
    Math.abs(guideLine - Math.round((startOfNext + endOfNext) / 2));

const isInOneLine = (direction: string, nextContext: Context, currentContext: Context) => {
    const currentLayout = currentContext.layout;
    const nextLayout = nextContext.layout;

    if (nextContext.children.length > 0) {
        return false;
    }

    if (DIRECTION_VERTICAL.includes(direction)) {
        const diff = Math.abs(nextLayout.yMin - currentLayout.yMin);
        return diff <= 20;
    }

    const diff = Math.abs(nextLayout.xMin - currentLayout.xMin);
    return diff <= 20;
};

export const distCalc = (
    output: any,
    nextContext: Context,
    guideLine: number,
    currentRectDimension: number,
    p3: number,
    p4: number,
    p5: number,
    p6: number,
    p7: number,
    p8: number,
    p9: number,
    p12: number,
    direction: string,
    contextParameters: any
) => {
    const { currentContext }: { currentContext: Context } = contextParameters;
    // First we search based on the distance to guide line
    const ix = intersects(guideLine, currentRectDimension, p3, p4);
    const ixOffset = intersectsOffset(guideLine, p3, p4);
    const nextVisible = nextIsVisible(p12, direction);
    const inOneLine = isInOneLine(direction, nextContext, currentContext);

    const closestDistance = Math.abs(p5 - p6);
    const cornerDistance = p7 - p8;
    if (
        ix &&
        !inOneLine &&
        cornerDistance < 0 &&
        output.match1 >= closestDistance &&
        output.match1IxOffset >= ixOffset
    ) {
        output.match1 = closestDistance;
        output.match1Context = nextContext;
        output.match1IxOffset = ixOffset;
        logger.debug('FOUND CLOSER M1', nextContext.id, closestDistance);
    }

    // Next up based on component size and it's center point
    const ix2 = intersects(p9, currentRectDimension, p3, p4);
    if (
        ix2 &&
        !inOneLine &&
        nextVisible &&
        cornerDistance < 0 &&
        output.match2 >= closestDistance &&
        output.match2IxOffset >= ixOffset
    ) {
        output.match2 = closestDistance;
        output.match2Context = nextContext;
        logger.debug('FOUND CLOSER M2', nextContext.id, closestDistance);
    }
    // Finally a search is based on arbitrary cut off size, so we could focus not entirely aligned items
    const ix3 = intersects(p9, CUTOFF_SIZE, p3, p4);

    if (
        ix3 &&
        !inOneLine &&
        nextVisible &&
        cornerDistance < 0 &&
        output.match3 >= closestDistance &&
        output.match3IxOffset >= ixOffset
    ) {
        output.match3 = closestDistance;
        output.match3Context = nextContext;
        logger.debug('FOUND CLOSER M3', nextContext.id, closestDistance);
    }
};

const executeScroll = (direction: string, contextParameters: any) => {
    const {
        currentContext,
        contextMap,
        isDebuggerEnabled,
    }: {
        currentContext: Context;
        contextMap: ContextMap;
        isDebuggerEnabled: boolean;
    } = contextParameters;

    if (!currentContext?.layout) {
        //eslint-disable-next-line
        console.warn('Current context were removed during scroll find');
        return;
    }

    const scrollContexParents = [];
    let parent = currentContext?.parent;
    // We can only scroll 2 ScrollView at max. one Horz and Vert
    const directionsFilled: any[] = [];
    while (parent) {
        if (parent.isScrollable && !directionsFilled.includes(parent.isHorizontal)) {
            directionsFilled.push(parent.isHorizontal);
            scrollContexParents.push(parent);
        }
        parent = parent?.parent;
    }

    scrollContexParents.forEach((p: any) => {
        const scrollTarget = p.isHorizontal
            ? calculateHorizontalScrollViewTarget(direction, p, contextParameters)
            : calculateVerticalScrollViewTarget(direction, p, contextParameters);

        if (scrollTarget) {
            // log('SCROLLING!!!!', scrollTarget);
            p.node.current.scrollTo(scrollTarget);
            p.scrollOffsetX = scrollTarget.x;
            p.scrollOffsetY = scrollTarget.y;
            if (isDebuggerEnabled) {
                Object.values(contextMap).forEach((v) => {
                    recalculateLayout(v);
                });
            } else {
                recalculateLayout(currentContext);
            }
        }
    });
};

const calculateHorizontalScrollViewTarget = (direction: string, scrollView: any, contextParameters: any) => {
    const { currentContext }: { currentContext: Context } = contextParameters;
    const { horizontalWindowAlignment }: any = currentContext.screen;
    const currentLayout = currentContext.layout;
    const scrollTarget = { x: scrollView.scrollOffsetX, y: scrollView.scrollOffsetY };

    const isHorizontalBothEdge = horizontalWindowAlignment === WINDOW_ALIGNMENT.BOTH_EDGE;
    // This will be executed if we have nested scroll view
    // and jumping between scroll views with buttons UP or DOWN
    if (DIRECTION_VERTICAL.includes(direction)) {
        if (scrollView.scrollOffsetX > currentLayout.xMin) {
            scrollTarget.x = currentLayout.xMin - VIEWPORT_PADDING;
        } else if (scrollView.scrollOffsetX + windowWidth < currentLayout.xMax) {
            scrollTarget.x = isHorizontalBothEdge
                ? currentLayout.xMax - windowWidth + VIEWPORT_PADDING
                : currentLayout.xMin - VIEWPORT_PADDING;
        }
    }

    if (DIRECTION_RIGHT.includes(direction)) {
        if (isHorizontalBothEdge) {
            scrollTarget.x = Math.max(currentLayout.xMax - (windowWidth - VIEWPORT_PADDING), scrollView.scrollOffsetX);
            if (scrollTarget.x > scrollView.layout.innerView.xMax) scrollTarget.x = scrollView.layout.innerView.xMax;
        } else {
            //Prevent OVERSCROLL
            const targetX = currentLayout.xMin - scrollView.layout.xMin - VIEWPORT_PADDING + windowWidth;
            if (scrollView.layout.xMaxScroll >= targetX) {
                scrollTarget.x = currentLayout.xMin - scrollView.layout.xMin - VIEWPORT_PADDING;
            } else {
                scrollTarget.x = scrollView.layout.xMaxScroll + VIEWPORT_PADDING - windowWidth;
            }
        }
    }

    if (DIRECTION_LEFT.includes(direction)) {
        if (isHorizontalBothEdge) {
            scrollTarget.x = Math.min(currentLayout.xMin - VIEWPORT_PADDING, scrollView.scrollOffsetX);
            if (scrollTarget.x < scrollView.layout.innerView.xMin) scrollTarget.x = scrollView.layout.innerView.xMin;
        } else {

            scrollTarget.x = Math.min(currentLayout.xMin - scrollView.layout.xMin - VIEWPORT_PADDING, scrollView.scrollOffsetX);
        }
    }

    if (scrollTarget.x < 0) scrollTarget.x = 0;
    if (scrollTarget.y < 0) scrollTarget.y = 0;

    return scrollTarget;
};

const calculateVerticalScrollViewTarget = (direction: string, scrollView: any, contextParameters: any) => {
    const { currentContext }: { currentContext: Context } = contextParameters;
    const { verticalWindowAlignment }: any = currentContext.screen;
    const currentLayout = currentContext.layout;
    const scrollTarget = { x: scrollView.scrollOffsetX, y: scrollView.scrollOffsetY };

    const isVerticalBothEdge = verticalWindowAlignment === WINDOW_ALIGNMENT.BOTH_EDGE;

    // This will be executed if we have nested scroll view
    // and jumping between scroll views with buttons UP or DOWN
    if (DIRECTION_HORIZONTAL.includes(direction)) {
        if (isVerticalBothEdge && currentLayout.absolute.yMax > windowHeight) {
            scrollTarget.y = currentLayout.yMin - scrollView.layout.yMin - VIEWPORT_PADDING;
        } else if (!isVerticalBothEdge) {
            //TODO FIX: OPEN MENU GO BACK TO CONTENT AND DIRECTIONS LOST
            //TODO ignore initial values
            // scrollTarget.y = Math.min(currentLayout.yMin - scrollView.layout.yMin - VIEWPORT_PADDING, scrollView.scrollOffsetY);
        }
    }

    if (DIRECTION_DOWN.includes(direction)) {
        if (isVerticalBothEdge) {
            scrollTarget.y = Math.max(currentLayout.yMax - (windowHeight - VIEWPORT_PADDING), scrollView.scrollOffsetY);
        } else {
            //Prevent OVERSCROLL
            const targetY = currentLayout.yMin - scrollView.layout.yMin - VIEWPORT_PADDING + windowHeight;
            if (scrollView.layout.yMaxScroll >= targetY) {
                scrollTarget.y = currentLayout.yMin - scrollView.layout.yMin - VIEWPORT_PADDING;
            } else {
                scrollTarget.y = scrollView.layout.yMaxScroll - windowHeight;
            }

        }
    }

    if (DIRECTION_UP.includes(direction)) {
        scrollTarget.y = Math.min(currentLayout.yMin - VIEWPORT_PADDING, scrollView.scrollOffsetY);
    }

    if (scrollTarget.x < 0) scrollTarget.x = 0;
    if (scrollTarget.y < 0) scrollTarget.y = 0;

    return scrollTarget;
};

export { executeScroll };