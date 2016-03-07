import * as types from '../constants/actionTypes'

const initialState = {
    isLogin: false
}

export default function login(state = initialState, action = {}) {
    switch (action.type) {
    case types.LOGIN:
        return {
            ...state,
            isLogin: true
        }
    case types.LOGOUT:
        return {
            ...state,
            isLogin: false
        }
    default:
        return state
    }
}
