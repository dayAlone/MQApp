import * as types from '../constants/actionTypes'

const initialState = false

export default function login(state = initialState, action = {}) {
    switch (action.type) {
    case types.SHOW_SPINNER:
        return true
    case types.HIDE_SPINNER:
        return false
    default:
        return state
    }
}
