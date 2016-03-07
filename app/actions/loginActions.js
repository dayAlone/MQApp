import base64 from 'base-64'
import * as types from '../constants/actionTypes'
import { API_DOMAIN, API_URL, API_TIMEOUT } from '../constants/config'
import { Alert } from 'react-native'
import timeout from '../libs/timeout'
import fetchError from '../libs/fetchError'

export function logOut() {
    return dispatch => {
        dispatch({
            type: types.SHOW_SPINNER
        })

        timeout(API_TIMEOUT, fetch(
            API_DOMAIN + '?logout=yes'
        ))
            .catch(fetchError(dispatch))
            .then((responseData) => {
                dispatch({
                    type: types.LOGOUT
                })
                dispatch({
                    type: types.HIDE_SPINNER
                })
            })
    }
}

export function isLoggedIn() {
    return dispatch => {
        dispatch({
            type: types.SHOW_SPINNER
        })

        timeout(API_TIMEOUT, fetch(
            API_URL + 'isloggedin'
        ))
            .then((response) => response.json())
            .catch(fetchError(dispatch))
            .then((responseData) => {

                if (responseData) {
                    let response = responseData[0]
                    if (response.status === 'OK') {
                        dispatch({
                            type: types.LOGIN
                        })
                    } else {
                        dispatch({
                            type: types.HIDE_SPINNER
                        })
                    }
                }
            })
    }
}
export function checkAuth(login, password) {
    return dispatch => {
        dispatch({
            type: types.SHOW_SPINNER
        })
        timeout(API_TIMEOUT, fetch(
            API_URL + 'checkauth',
            {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${base64.encode(
                        login + ':' + password
                    )}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',

                }
            }
        ))
            .then((response) => response.json())
            .catch(fetchError(dispatch))
            .then((responseData) => {
                if (responseData) {
                    let response = responseData[0]
                    if (response.status === 'ERROR') {
                        dispatch({
                            type: types.HIDE_SPINNER
                        })
                        Alert.alert('Ошибка входа', response.status_msg)

                    } else {
                        dispatch({
                            type: types.LOGIN
                        })
                    }
                }
            })
    }
}
