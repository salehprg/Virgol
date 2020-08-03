import {START, STOP} from "../_actions/workerTypes";

const INITIAL_STATE = { status: false }

export default ( state = INITIAL_STATE, action ) => {

    switch (action.type) {

        case START: return { status: true }
        case STOP: return INITIAL_STATE
        default: return state

    }

}