import * as Type from "../_actions/paymentsTypes";
import {LOGOUT} from "../_actions/authTypes";

const INITIAL_STATE = {
    services : [],
    paymentDetail : {},
    amount : null
}

export default ( state = INITIAL_STATE, action ) => {
    switch (action.type) {

        case Type.GetServices: 
            return { ...state, services: action.payload}

        case Type.GetPaymentDetail: 
            return { ...state, paymentDetail: action.payload}

        case Type.CalculateAmount: 
            return { ...state, amount: action.payload}
            
        default: return state

    }

}