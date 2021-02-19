import * as Type from "../_actions/authTypes";
import { SetMeetingService } from "../_actions/teachersTypes";

const INITIAL_STATE = {
    'authed': false,
    'userType': -1,
    'userInfo': null,
    'status': false ,
    'loginEffort' : 0
}

export default ( state = INITIAL_STATE, action ) => {

    switch (action.type) {

        case Type.LOGIN: 
            return { ...state, authed: true, userType: action.payload.userType, userInfo: action.payload }

        case Type.USER_STATUS: 
            return { ...state, status: true }

        case Type.LOGOUT: 
            return INITIAL_STATE

        case SetMeetingService:
            return { ...state, userInfo: { ...state.userInfo, userDetail: { ...state.userInfo.userDetail, userDetail: { ...state.userInfo.userDetail.userDetail, meetingService: action.payload } } } }

        case Type.INCREASE_EFFORT:
            return{ ...state , loginEffort : state.loginEffort+action.payload}
            
        default: return state

    }

}