import * as types from '../constants/actionTypes'

const initialState = {
    items: [],
    dates: [],
    sort: -1,
    filter: false,
    types: false
}

export default function contacts(state = initialState, action = {}) {
    switch (action.type) {
    case types.SET_SORT:
        return {
            ...state,
            sort: action.sort,
            dates: action.dates
        }
    case types.GET_CONTACTS:
        return {
            ...state,
            items: action.items,
            dates: action.dates
        }
    default:
        return state
    }
}
