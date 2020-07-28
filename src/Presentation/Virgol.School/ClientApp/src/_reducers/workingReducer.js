import {START_WORKING, STOP_WORKING} from "../_types/workingTypes";

const INITIAL_STATE = {
    'working': false
}

export default (state = INITIAL_STATE, action) => {

    if (action.type === START_WORKING) {
        return {...state, working: true}
    }

    if (action.type === STOP_WORKING) {
        return {...state, working: false}
    }

    return state;

}