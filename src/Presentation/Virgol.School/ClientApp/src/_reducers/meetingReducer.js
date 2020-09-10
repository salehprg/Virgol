import * as Type from "../_actions/meetingTypes";
import {LOGOUT} from "../_actions/authTypes";

const INITIAL_STATE = {
    meetingDetail : null,
    participantsList : null,
    recordings : null
}

export default ( state = INITIAL_STATE, action ) => {

    switch (action.type) {

        case Type.GetRecentClass: 
            return { ...state, recentClass: action.payload}

        case Type.GetMeetingList: 
            return { ...state, meetingList: action.payload}

        case Type.GetMeetingDetail: 
            return { ...state, meetingDetail: action.payload}
            
        case Type.GetParticipantList: 
            return { ...state, participantsList: action.payload}

        case Type.GetAllActiveMeeting:
            return { ...state , activeMeetings : action.payload}

        case Type.GetRecordList:
            return { ...state , recordings : action.payload}

        case LOGOUT: 
            return INITIAL_STATE
            
        default: return state

    }

}