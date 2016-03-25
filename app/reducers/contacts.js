import * as types from '../constants/actionTypes'
const initialState = {
    allItems: [],
    items: [],
    dates: [],
    sort: -1,
    filter: 0,
    types: false
}


export default function contacts(state = initialState, action = {}) {
    switch (action.type) {
    case types.SET_FILTER:
        return {
            ...state,
            filter: action.filter,
            items: action.items,
            dates: action.dates
        }
    case types.SET_SORT:
        return {
            ...state,
            sort: action.sort,
            dates: action.dates
        }
    case types.GET_CONTACTS:
        return {
            ...state,
            allItems: action.allItems,
            items: action.items,
            dates: action.dates
        }
    default:
        return state
    }
}
