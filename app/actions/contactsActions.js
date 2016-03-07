/*global _:true*/
import * as types from '../constants/actionTypes'
import { API_URL, API_TIMEOUT } from '../constants/config'
import timeout from '../libs/timeout'
import fetchError from '../libs/fetchError'
import 'lodash'
import { Alert } from 'react-native'
import moment from 'moment'

export function setSort(sort) {
    return (dispatch, getState) => {
        let { contacts } = getState()
        let dates = contacts.dates.sort((a, b) => moment(a, 'DD.MM.YYYY').isBefore(moment(b, 'DD.MM.YYYY')) ? 1 * contacts.sort : -1 * contacts.sort)
        Alert.alert('Ошибка входа', JSON.stringify(dates))
        dispatch({
            type: types.SET_SORT,
            sort: sort,
            dates: dates
        })
    }
}

export function getContactsList(spinner = true) {
    return (dispatch, getState) => {
        let { contacts } = getState()
        let { sort } = contacts
        if (spinner) {
            dispatch({
                type: types.SHOW_SPINNER
            })
        }

        timeout(API_TIMEOUT, fetch(
            API_URL + 'get_contact_list'
        ))
            .then((response) => response.json())
            .catch(fetchError(dispatch))
            .then((responseData) => {
                if (responseData) {
                    let response = responseData[0]

                    if (response.status === 'OK') {
                        let dates = _.uniq(response.contact_list
                                            .map(el => (
                                                    moment(el.DATE_REGISTER, 'DD.MM.YYYY HH:mm:SS')
                                                        .format('DD.MM.YYYY')
                                                )))
                        dispatch({
                            items: response.contact_list,
                            dates: dates.sort((a, b) => moment(a, 'DD.MM.YYYY').isBefore(moment(b, 'DD.MM.YYYY')) ? -1 * sort : 1 * sort)
                        })
                    }
                }
                if (spinner) {
                    dispatch({
                        type: types.HIDE_SPINNER
                    })
                }
            })
    }
}
