import * as Type from "../_actions/teachersTypes";
import {LOGOUT} from "../_actions/authTypes";

const INITIAL_STATE = {
    classBook : []
}

export default ( state = INITIAL_STATE, action ) => {

    switch (action.type) {

        case Type.GetClassBook: 
            return { ...state, classBook: action.payload}
            
        default: return state

    }

}