/*global _:true*/

import { API_TIMEOUT } from '../constants/config'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as contactsActions from '../actions/contactsActions'
import moment from 'moment'
import 'lodash'
import React, {
    Component,
    StyleSheet,
    View,
    Text,
    ListView,
    PullToRefreshViewAndroid
} from 'react-native'
import DateCell from '../components/DateCell'


class GroupsScreen extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        isRefreshing: false,
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => true,
        }),
    };
    componentDidMount() {
        this.props.actions.getContactsList()
    }
    componentWillReceiveProps(nextProps) {
        let dates = nextProps.dates.map(date => {
            let count = _.filter(nextProps.contacts, el => {
                return moment(el.DATE_REGISTER, 'DD.MM.YYYY HH:mm:SS').format('DD.MM.YYYY') === date
            }).length
            return { date: date, count: count }
        })
        this.setState({
            isRefreshing: false,
            dataSource: this.state.dataSource.cloneWithRows(dates)
        })
    }
    renderSeparator(sectionID, rowID) {
        return <View
            key={`separator_${sectionID}_${rowID}`}
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                height: 1,
                marginLeft: 4
            }}/>
    }
    renderFooter() {

    }
    renderRow(row, sectionID, rowID) {

        return (
            <DateCell
                date={row.date}
                count={row.count}
                key={`row_${sectionID}_${rowID}`}
                navigator={this.props.navigator}
            />
        )

    }
    refreshContacts() {
        this.props.actions.getContactsList(false)
        setTimeout(()=>(this.setState({ isRefreshing: false })), API_TIMEOUT)
        this.setState({ isRefreshing: true })
    }
    render() {
        return (
            <PullToRefreshViewAndroid
                colors={['#06a5d1']}
                style={styles.layout}
                onRefresh={this.refreshContacts.bind(this)}
                refreshing={this.state.isRefreshing}
                >
                { this.state.dataSource._cachedRowCount > 0 || this.props.spinner ? <ListView
                    ref='listview'
                    renderSeparator={this.renderSeparator}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    automaticallyAdjustContentInsets={false}
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps={true}
                    showsVerticalScrollIndicator={false}
                    />
                : <View style={styles.message}>
                        <Text style={styles.messageText}>
                            {!this.props.filter ? 'Контакты не найдены' : 'Выбранный тип контактов не найден'}</Text>
                    </View> }
            </PullToRefreshViewAndroid>
        )
    }
}

const styles = StyleSheet.create({
    layout: {
        flex: 1,
    },
    scrollview: {
        flex: 1,
    },
    message: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 30
    },
    messageText: {
        color: 'rgba(0,0,0,.5)',
        fontSize: 15
    }
})

export default connect(
    state => ({
        dates: state.contacts.dates,
        contacts: state.contacts.items,
        filter: state.contacts.filter,
        spinner: state.spinner }),
    (dispatch) => ({
        actions: bindActionCreators(contactsActions, dispatch)
    })
)(GroupsScreen)
