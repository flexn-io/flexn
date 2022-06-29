import React, { useContext, useState } from 'react';
import { View, TouchableOpacity, Text } from '@flexn/sdk';
import { testProps } from '../utils';
import { isFactorBrowser } from '@rnv/renative';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext, ROUTES } from '../config';
import { useNavigate } from '../hooks';

export const DrawerButton = ({ navigation }: { navigation?: any }) => {
    const { theme } = useContext(ThemeContext);
    return (
        <TouchableOpacity
            onPress={() => {
                if (navigation && navigation.dispatch) navigation.dispatch({ type: 'OPEN_DRAWER' });
            }}
            {...testProps('template-menu-drawer-button')}
        >
            <Icon name="menu" color={theme.static.colorTextPrimary} size={theme.static.buttonSize} />
        </TouchableOpacity>
    );
};

const Menu = ({ navigation }: { navigation?: any }) => {
    const navigate = useNavigate({ navigation });
    const { theme } = useContext(ThemeContext);
    const [burgerMenuOpen, setBurgerMenuOpen] = useState<boolean>(false);

    const onPress = (route: string) => {
        navigate(route);
        setBurgerMenuOpen(false);
    };

    const renderMenuItems = () => (
        <>
            <TouchableOpacity
                onPress={() => onPress(ROUTES.HOME)}
                style={theme.styles.menuButton}
                {...testProps('template-menu-home-button')}
            >
                <Icon
                    name="md-home"
                    size={theme.static.iconSize}
                    color={theme.static.colorBrand}
                />
                <Text style={[theme.styles.buttonText, theme.styles.menuButtonText]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onPress(ROUTES.CAROUSELS)}
                style={theme.styles.menuButton}
                {...testProps('template-menu-carousels-button')}
            >
                <Icon
                    name="md-rocket"
                    size={theme.static.iconSize}
                    color={theme.static.colorBrand}
                />
                <Text style={[theme.styles.buttonText, theme.styles.menuButtonText]}>Carousels</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onPress(ROUTES.MODAL)}
                style={theme.styles.menuButton}
                {...testProps('template-menu-my-modal-button')}
            >
                <Icon
                    name="ios-albums"
                    size={theme.static.iconSize}
                    color={theme.static.colorBrand}
                />
                <Text style={[theme.styles.buttonText, theme.styles.menuButtonText]}>My Modal</Text>
            </TouchableOpacity>
        </>
    );

    const renderMenu = () => {
        if (isFactorBrowser) {
            return (
                <View
                    style={burgerMenuOpen ? theme.styles.menuItemsBurgerOpen : theme.styles.menuItems}
                    dataSet={{ media: burgerMenuOpen ? theme.ids.menuItemsBurgerOpen : theme.ids.menuItems }}
                >
                    {renderMenuItems()}
                </View>
            );
        }

        return renderMenuItems();
    };

    const renderBurgerButton = () => {
        if (isFactorBrowser) {
            return (
                <TouchableOpacity
                    style={[theme.styles.burgerMenuBtn, burgerMenuOpen && { display: 'flex' }]}
                    dataSet={{ media: theme.ids.burgerMenuBtn }}
                    onPress={() => setBurgerMenuOpen(!burgerMenuOpen)}
                >
                    <Icon
                        name={burgerMenuOpen ? 'md-close' : 'md-menu'}
                        size={theme.static.iconSize}
                        color={theme.static.colorBrand}
                    />
                </TouchableOpacity>
            );
        }

        return null;
    };

    return (
        <View
            style={[theme.styles.menuContainer, burgerMenuOpen && theme.styles.menuContainerBurgerOpen]}
            dataSet={{ media: `${theme.ids.menuContainer} ${burgerMenuOpen && theme.styles.menuContainerBurgerOpen}` }}
        >
            {renderBurgerButton()}
            {renderMenu()}
        </View>
    );
};

export default Menu;
