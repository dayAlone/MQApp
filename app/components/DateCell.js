/*global _:true*/
import moment from 'moment'
import pluralize from '../libs/pluralize'
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

class DateCell extends Component {
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
        let { date, contacts } = this.props
        let count = _.filter(contacts, el => {
            return moment(el.DATE_REGISTER, 'DD.MM.YYYY HH:mm:SS').format('DD.MM.YYYY') === date
        }).length
        let TouchableElement = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableHighlight
        return (
            <TouchableElement
                onPress={this._onPressButton.bind(this)}
                >
                <View style={styles.row}>
                    <Icon name='folder-shared' size={45} color='rgba(0,0,0,.2)' />
                    <View style={styles.text}>
                        <Text style={styles.title}>
                            {moment(date, 'DD.MM.YYYY').format('DD MMMM YYYY')}
                        </Text>
                        <Text style={styles.counter}>
                            {count + ' ' + pluralize(count, ['контакт', 'контакта', 'контактов', 'контакта'])}
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

export default connect(
    state => ({ dates: state.contacts.dates, contacts: state.contacts.items })
)(DateCell)
