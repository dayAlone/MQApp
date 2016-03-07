import * as types from '../constants/actionTypes'
import { Alert } from 'react-native'

export default (dispatch) => {
    return (error) => {
        if (
            error.message === 'timeout'
            || error.message.indexOf('Network') !== -1
        ) {
            Alert.alert('Ошибка сети', 'Сервер Kent недоступен')
        }
        console.log(error.stack)
        dispatch({
            type: types.HIDE_SPINNER
        })
    }
}
