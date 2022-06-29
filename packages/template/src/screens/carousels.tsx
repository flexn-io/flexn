import { List } from '@flexn/sdk';
import React, { useContext } from 'react';
import { isFactorMobile, isPlatformMacos, isPlatformWeb, isFactorTv } from '@rnv/renative';
import { ThemeContext, ROUTES, Ratio } from '../config';
import { getRandomData, interval, testProps } from '../utils';
import Screen from './screen';
import { View } from 'react-native';

const ScreenCarousels = ({ navigation }: { navigation?: any }) => {
    const { theme } = useContext(ThemeContext);

    const data = [...Array(10).keys()].map((rowNumber) => {
        const itemsInViewport = interval(isFactorMobile ? 1 : 3, isFactorMobile ? 3 : 5);
        return {
            items: getRandomData(rowNumber, undefined, itemsInViewport),
            itemsInViewport,
        };
    });

    return (
        <Screen style={[theme.styles.screen, styles.screen]}>
            <View
                {...testProps('template-carousels-screen-container')}
            >
                <List
                    items={data}
                    itemDimensions={{ height: isFactorMobile ? 200 : 250 }}
                    rowHeight={isFactorMobile ? 350 : 400}
                    animatorOptions={{ type: 'scale_with_border', scale: 1.1 }}
                    focusOptions={{ forbiddenFocusDirections: ['right'] }}
                    itemSpacing={isFactorMobile ? 15 : 30}
                    cardStyle={styles.cardStyle}
                    onPress={(data) => {
                        navigation.navigate(ROUTES.DETAILS, { row: data.rowNumber, index: data.index });
                    }}
                />
            </View>
        </Screen>
    );
};

const styles = {
    screen: {
        left: isFactorMobile || isPlatformMacos || isPlatformWeb  ? 0 : Ratio(100),
    },
    cardStyle: {
        borderWidth: isFactorMobile ? 0 : 5,
        borderRadius: 5,
        borderColor: isFactorTv ? '#0A74E6' : 'transparent',
        fontSize: isFactorMobile ? 16 : 26
    },
};

export default ScreenCarousels;
