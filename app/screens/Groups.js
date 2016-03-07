import { API_TIMEOUT } from '../constants/config'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as contactsActions from '../actions/contactsActions'
import React, {
    Component,
    StyleSheet,
    View,
    ListView,
    PullToRefreshViewAndroid
} from 'react-native'
import moment from 'moment'
import DateCell from '../components/DateCell'

class GroupsScreen extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        isRefreshing: false,
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        }),
    };
    componentDidMount() {
        this.props.actions.getContactsList()
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            isRefreshing: false,
            dataSource: this.state.dataSource.cloneWithRows(nextProps.dates)
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
    renderRow(date, sectionID, rowID) {
        return (
            <DateCell
                date={date}
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
                <ListView
                    ref='listview'
                    renderSeparator={this.renderSeparator}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    automaticallyAdjustContentInsets={false}
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps={true}
                    showsVerticalScrollIndicator={false}
                    />
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
})

export default connect(
    state => ({ dates: state.contacts.dates, contacts: state.contacts.items }),
    (dispatch) => ({
        actions: bindActionCreators(contactsActions, dispatch)
    })
)(GroupsScreen)
