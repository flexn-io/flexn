import { TouchableOpacity, Text, ScrollView } from '@flexn/sdk';
import React from 'react';
import { Dimensions } from 'react-native';
import Screen from '../../../../components/Screen';
import { themeStyles } from '../../../../config';
import { testProps, Ratio } from '../../../../utils';

const { width } = Dimensions.get('screen');
const rows = new Array(10).fill(0);

const ViewportSideEdgeVertical = () => (
    <Screen
        style={[themeStyles.screen, { justifyContent: 'center', alignItems: 'center' }]}
        focusOptions={{ verticalWindowAlignment: 'both-edge' }}
    >
        <Text style={themeStyles.textH2}>Focus Test 1 (Viewport Side Edge)</Text>
        <ScrollView>
            {rows.map((row) => (
                <TouchableOpacity
                    key={row}
                    style={{
                        width: width - Ratio(300),
                        height: Ratio(300),
                        backgroundColor: 'teal',
                        marginVertical: Ratio(80),
                    }}
                    focusOptions={{
                        animatorOptions: {
                            type: 'border',
                            colorFocus: '#ff0000',
                            borderWidth: Ratio(3),
                        },
                    }}
                    {...testProps('flexn-screens-focus-misaligned-buttons-btn-1')}
                />
            ))}
        </ScrollView>
    </Screen>
);

export default ViewportSideEdgeVertical;
