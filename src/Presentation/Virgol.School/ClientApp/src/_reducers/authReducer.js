import * as Type from "../_actions/authTypes";

const INITIAL_STATE = {
    'authed': false,
    'userType': -1,
    'userInfo': null,
    'status': false
}

export default ( state = INITIAL_STATE, action ) => {

    switch (action.type) {

        case Type.LOGIN: 
            return { ...state, authed: true, userType: action.payload.userType, userInfo: action.payload }

        case Type.USER_STATUS: 
            return { ...state, status: true }

        case Type.LOGOUT: 
            return INITIAL_STATE
            
        default: return state

    }

}