import * as Type from "../_actions/streamTypes";
import {LOGOUT} from "../_actions/authTypes";

const INITIAL_STATE = {
    currentStream : {},
    activeStream : {},
    endedStream : [],
    futureStream : [],
    roles : []
}

export default ( state = INITIAL_STATE, action ) => {

    switch (action.type) {
        case Type.GetFutureStreams:
            return { ...state, futureStream: action.payload };

        case Type.GetEndedStreams:
            return { ...state, endedStream: action.payload };

        case Type.GetRoles:
            return { ...state, roles: action.payload };

        case Type.GetCurrentStream:
            return { ...state, currentStream: action.payload };

        case Type.GetActiveStream:
            return { ...state, activeStream: action.payload };

        default: return state

    }

}