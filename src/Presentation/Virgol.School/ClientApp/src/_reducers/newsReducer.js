import * as Type from "../_actions/newsTypes";
import {LOGOUT} from "../_actions/authTypes";

const INITIAL_STATE = {
    myNews : [],
    newsDetail : {},
    incomeNews : []
}

export default ( state = INITIAL_STATE, action ) => {

    switch (action.type) {

        case Type.GetNewsDetail: 
            return { ...state, newsDetail: action.payload}

        case Type.GetMyNews: 
            return { ...state, myNews: action.payload}

        case Type.GetIncommingNews: 
            return { ...state, incomeNews: action.payload}

        case Type.GetAccessRoleIds: 
            return { ...state, accessRole: action.payload}

        case Type.CreateNews: 
            return { ...state, myNews: [...state.myNews, action.payload]};

        case Type.EditNews: 
            return { ...state, myNews: state.myNews.map(el => el.id === action.payload.id ? action.payload : el) }

        case Type.RemoveNews: 
            return { ...state, myNews: state.myNews.filter(element => action.payload != element.id) }

        case LOGOUT: 
            return INITIAL_STATE
            
        default: return state

    }

}