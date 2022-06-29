import { Text, View } from '@flexn/sdk';
import React from 'react';
import { Button, getScaledValue, Icon, StyleSheet, useNavigate, useOpenDrawer } from '@rnv/renative';
import Theme, { hasHorizontalMenu, ROUTES, themeStyles } from '../config';
import { testProps } from '../utils';

export const DrawerButton = (props) => {
    const openDrawer = useOpenDrawer(props);
    return (
        <Icon
            iconFont="ionicons"
            iconName="md-menu"
            iconColor={Theme.color3}
            size={Theme.iconSize}
            style={themeStyles.icon}
            onPress={() => {
                openDrawer('Drawer');
            }}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: getScaledValue(hasHorizontalMenu ? 20 : 40),
        paddingLeft: getScaledValue(hasHorizontalMenu ? 40 : 40),
        width: Theme.menuWidth,
        height: Theme.menuHeight,
        backgroundColor: Theme.color1,
        alignItems: 'flex-start',
        borderRightWidth: getScaledValue(hasHorizontalMenu ? 0 : 1),
        borderBottomWidth: getScaledValue(hasHorizontalMenu ? 1 : 0),
        borderColor: Theme.color5,
        flexDirection: hasHorizontalMenu ? 'row' : 'column',
    },
    button: {
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        marginHorizontal: hasHorizontalMenu ? getScaledValue(20) : 0,
        marginTop: hasHorizontalMenu ? 0 : getScaledValue(20),
        maxWidth: getScaledValue(400),
        minWidth: getScaledValue(50),
        borderWidth: 0,
    },
    buttonText: {
        fontFamily: 'Inter-Light',
        color: '#62DBFB',
        fontSize: getScaledValue(20),
    },
});

const Menu = (props) => {
    const navigate = useNavigate(props);

    return (
        <View style={styles.container}>
            <Text style={themeStyles.text}>Menu</Text>
            <Button
                title="Home"
                iconFont="ionicons"
                iconName="md-home"
                iconColor={Theme.color3}
                iconSize={Theme.iconSize}
                style={styles.button}
                textStyle={styles.buttonText}
                onPress={() => {
                    navigate(ROUTES.HOME, '/');
                }}
                onEnterPress={() => {
                    navigate(ROUTES.HOME, '/');
                }}
                {...testProps('flexn-components-button-home')}
            />
            <Button
                title="My Modal"
                iconFont="ionicons"
                iconName="ios-albums"
                iconColor={Theme.color3}
                iconSize={Theme.iconSize}
                style={styles.button}
                textStyle={styles.buttonText}
                onPress={() => {
                    navigate(ROUTES.MODAL, '/[slug]');
                }}
                onEnterPress={() => {
                    navigate(ROUTES.MODAL, '/[slug]');
                }}
                {...testProps('flexn-components-button-my-modal')}
            />
        </View>
    );
};

export default Menu;
