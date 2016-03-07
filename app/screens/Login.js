import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as loginActions from '../actions/loginActions'

import React, {
    Component,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View
} from 'react-native'
import dismissKeyboard from 'dismissKeyboard'

class LoginScreen extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        login: false,
        password: false,
        loginColor: '#06a5d1',
        passwordColor: '#06a5d1'
    };
    componentWillReceiveProps(nextProps) {
        if (!this.props.isLogin && nextProps.isLogin) {
            dismissKeyboard()
            this.props.navigator.push({
                name: 'groups'
            })
        }

    }
    onPressButton() {
        let state = {}
        if (!this.state.login || !this.state.password) {
            state = {
                loginColor: this.state.login ? '#06a5d1' : 'red',
                passwordColor: this.state.passoword ? '#06a5d1' : 'red'
            }
        } else {
            this.props.actions.checkAuth(this.state.login, this.state.password)
        }
        this.setState(state)
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        ref='login'
                        keyboardType='email-address'
                        placeholder='Логин'
                        underlineColorAndroid={this.state.loginColor}
                        autoCorrect={false}
                        onChangeText={(value) => {
                            this.setState({ login: value, loginColor: '#06a5d1' })
                        }}
                        />
                    <TextInput
                        style={styles.input}
                        ref='password'
                        placeholder='Пароль'
                        secureTextEntry={true}
                        autoCorrect={false}
                        underlineColorAndroid={this.state.passwordColor}
                        onChangeText={(value) => {
                            this.setState({ password: value, passwordColor: '#06a5d1' })
                        }}
                        onSubmitEditing={this.onPressButton.bind(this)}
                        />
                    <TouchableHighlight
                            onPress={this.onPressButton.bind(this)}
                            style={styles.button}
                            underlayColor='#06a5d1'
                            activeOpacity={1}
                        >
                        <Text style={styles.buttonText}>Войти</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d1d3d4',
        padding: 0,
        paddingTop: 0
    },
    form: {
        padding: 40,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        fontSize: 20,
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
    },
    button: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 8,
        paddingTop: 9,
        paddingBottom: 10,
        paddingLeft: 55,
        paddingRight: 55,
        margin: 30,
        marginBottom: 0,
        backgroundColor: '#06a5d1',
        elevation: 2,
    }
})

export default connect(
    state => ({ isLogin: state.login.isLogin, spinner: state.spinner }),
    dispatch => ({
        actions: bindActionCreators(loginActions, dispatch)
    })
)(LoginScreen)
