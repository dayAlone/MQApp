/*global _:true*/
import * as types from '../constants/actionTypes'
import { API_URL, API_TIMEOUT } from '../constants/config'
import timeout from '../libs/timeout'
import fetchError from '../libs/fetchError'
import 'lodash'

import moment from 'moment'

let sortDates = (dates, sort) => {
    return dates.sort((a, b) => moment(a, 'DD.MM.YYYY').isBefore(moment(b, 'DD.MM.YYYY')) ? -1 * sort : 1 * sort)
}
let getDates = (list) => {
    return _.uniq(list.map(el => (
                                moment(el.DATE_REGISTER, 'DD.MM.YYYY HH:mm:SS')
                                    .format('DD.MM.YYYY')
                            )))
}

export function setSort(sort) {
    return (dispatch, getState) => {
        let { contacts } = getState()
        let { dates } = contacts
        dates = sortDates(dates, sort)
        dispatch({
            type: types.SET_SORT,
            sort: sort,
            dates: dates
        })
    }
}

export function setFilter(filter) {
    return (dispatch, getState) => {
        let { contacts } = getState()
        let { allItems } = contacts
        let items = filter ? allItems.filter(el => (el.type === filter)) : allItems
        dispatch({
            type: types.SET_FILTER,
            filter: filter,
            items: items,
            dates: getDates(items)
        })
    }
}

export function getContactsList(spinner = true) {
    return (dispatch, getState) => {
        let { contacts } = getState()
        let { sort, filter } = contacts

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
                    let list = response.contact_list
                    let filterList = filter ? list.filter(el => (el.type === filter)) : list
                    if (response.status === 'OK') {
                        let dates = getDates(list)
                        dispatch({
                            type: types.GET_CONTACTS,
                            allItems: list,
                            items: filterList,
                            dates: sortDates(dates, sort)
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
