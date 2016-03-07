/*global _:true*/
import moment from 'moment'
import pluralize from '../libs/pluralize'
import { USER_TYPES } from '../constants/config'
import 'moment/locale/ru'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import 'lodash'

import React, {
    Component,
    StyleSheet,
    TouchableHighlight,
    TouchableNativeFeedback,
    Platform,
    Text,
    View
} from 'react-native'

class ContactCell extends Component {
    constructor(props) {
        super(props)
    }

    _onPressButton() {
        this.props.navigator.push({
            name: 'contacts',
            date: this.props.date,
            title: moment(this.props.date, 'DD.MM.YYYY').format('DD MMMM YYYY'),
        })
    }
    render() {
        let { contact } = this.props

        let TouchableElement = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableHighlight
        return (
            <TouchableElement
                onPress={this._onPressButton.bind(this)}
                >
                <View style={styles.row}>
                    <Icon name='face' size={45} color='rgba(0,0,0,.2)' />
                    <View style={styles.text}>
                        <Text style={styles.title}>
                            {contact.NAME} {contact.LAST_NAME}
                        </Text>
                        <Text style={styles.counter}>
                            {USER_TYPES[contact.type]}
                        </Text>
                    </View>
                </View>
            </TouchableElement>
        )
    }
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 13
    },
    text: {
        paddingLeft: 12
    },
    counter: {
        color: 'rgba(0, 0, 0, .4)',
        fontSize: 12
    },
    title: {
        color: 'black',
        fontSize: 16,
        marginBottom: 3
    }
})

export default ContactCell
