import { SUCCESS, ERROR, CLEAR } from '../_actions/alertTypes';

const INITIAL_STATE = {}

export default ( state = INITIAL_STATE, action ) => {

    switch (action.type) {

        case SUCCESS: return { type: 'alert-success', message: action.payload }
        case ERROR: return { type: 'alert-error', message: action.payload }
        case CLEAR: return INITIAL_STATE
        default: return state

    }

}