import React, {
    Component,
    StyleSheet,
    View,
    BackAndroid,
    Navigator,
    Alert,
    Text,
    ToastAndroid
} from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as loginActions from '../actions/loginActions'
import * as contactsActions from '../actions/contactsActions'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Spinner from 'react-native-loading-spinner-overlay'
import StatusBar from 'StatusBar'
import ToolbarAndroid from 'ToolbarAndroid'
import LoginScreen from '../screens/Login'
import GroupsScreen from '../screens/Groups'
import ContactsScreen from '../screens/Contacts'
import { USER_TYPES } from '../constants/config'
import DialogAndroid from 'react-native-dialogs'

var _navigator
BackAndroid.addEventListener('hardwareBackPress', () => {
    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
        _navigator.pop()
        return true
    }
    return false
})

const RouteMapper = (props, state, setState) => {
    return (route, navigationOperations) => {
        _navigator = navigationOperations
        let content = false
        let toolbar = {}
        let onActionSelected = null

        switch (route.name) {
        case 'contacts':
            toolbar = {
                title: route.title,
                actions: [
                    { title: 'Поиск', iconName: 'search', show: 'always', iconColor: 'white' },
                    { title: 'Фильтровать', iconName: 'filter-list', show: 'always', iconColor: 'white' },
                    { title: 'Сортировка', iconName: 'sort', show: 'always', iconColor: 'white' },
                ],
                navIconName: 'menu',
                iconClicked: () => {
                    navigationOperations.pop()
                }
            }
            content = <ContactsScreen
                date={route.date}
                style={{ flex: 1 }}
                navigator={navigationOperations}
                />
            break
        case 'groups':

            toolbar = {
                title: 'Контакты',
                actions: [
                    { title: 'Поиск', iconName: 'search', show: 'always', iconColor: 'white' },
                    { title: 'Фильтровать', iconName: 'filter-list', show: 'always', iconColor: 'white' },
                    { title: 'Сортировка', iconName: 'sort', show: 'always', iconColor: 'white' },
                ],
                navIconName: 'menu',
                iconClicked: () => {
                    props.actions.logOut()
                    navigationOperations.pop()

                }
            }
            onActionSelected = (key) => {
                let dialog = new DialogAndroid()
                switch (key) {
                case 1:

                    dialog.set({
                        items: [
                            'Все',
                            ...USER_TYPES.filter(el => el.length > 0)
                        ],
                        selectedIndex: 0,
                        title: 'Тип пользователя',
                        itemsCallbackSingleChoice: (id, text) => ToastAndroid.show(id + ': ' + text, ToastAndroid.SHORT)
                    })
                    dialog.show()
                    break
                case 2:
                    dialog.set({
                        items: [
                            'По убыванию',
                            'По возрастанию'
                        ],
                        selectedIndex: props.sort == -1 ? 0 : 1,
                        title: 'Тип пользователя',
                        itemsCallbackSingleChoice: (id, text) => props.contacts.setSort(id == 0 ? -1 : 1)
                    })
                    dialog.show()
                    break
                    default:

                }
            }
            content = <GroupsScreen
                style={{ flex: 1 }}
                navigator={navigationOperations}
                />
            break
        default:
            toolbar = {
                title: 'Авторизация',
                actions: [],
                navIconName: null
            }
            content = <LoginScreen
                style={{ flex: 1 }}
                navigator={navigationOperations}
                />

        }
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <StatusBar
                    backgroundColor='#05223b'
                    />
                <Icon.ToolbarAndroid
                    navIconName={toolbar.navIconName}
                    actions={toolbar.actions}
                    onIconClicked={toolbar.iconClicked}
                    style={styles.toolbar}
                    titleColor='white'
                    title={toolbar.title}
                    subtitleColor='rgba(255,255,255,.3)'
                    onActionSelected={onActionSelected}
                    />

                {content}

            </View>
        )
    }
}


class MQApp extends Component {
    constructor(props) {
        super(props)
    }
    state = {};
    renderNavigationView() {
        return <View/>
    }
    componentDidMount() {
        this.props.actions.isLoggedIn()
    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                <Navigator
                    style={styles.container}
                    initialRoute={{ name: 'login' }}
                    configureScene={() => Navigator.SceneConfigs.FloatFromRight}
                    renderScene={RouteMapper(this.props)}
                    />
                <Spinner visible={this.props.spinner}/>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    toolbar: {
        backgroundColor: '#083051',
        height: 54,
        elevation: 20
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
})

export default connect(
    state => ({ isLogin: state.login.isLogin, spinner: state.spinner, sort: state.contacts.sort }),
    (dispatch) => ({
        actions: bindActionCreators(loginActions, dispatch),
        contacts: bindActionCreators(contactsActions, dispatch)
    })
)(MQApp)
