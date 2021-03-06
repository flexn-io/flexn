import React from 'react';
import { Grid } from '@flexn/sdk';
import Screen from '../../../../components/Screen';

function generateData(width, height, items = 10) {
    const temp: any = [];
    for (let index = 0; index < items; index++) {
        temp.push({
            index,
            backgroundImage: `https://placekitten.com/${width + index}/${height}`,
        });
    }

    return temp;
}

const GridTest = () => {
    const data = [...generateData(400, 250), ...generateData(400, 250), ...generateData(400, 250)];

    return (
        <Screen>
            <Grid items={data} itemsInViewport={5} itemSpacing={30} itemDimensions={{ height: 200 }} />
        </Screen>
    );
};

export default GridTest;
