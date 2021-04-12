import * as Type from '../_actions/coManagerTypes'
import { LOGOUT } from "../_actions/authTypes";

const INITIAL_STATE = {
    coManagers : [],
    selectedCManager : null
}

export default (state = INITIAL_STATE, action) => {


    if (action.type === Type.AddNewCoManager)
        return { ...state, coManagers: [...state.coManagers, action.payload] };

    if (action.type === Type.RemoveCoManager)
        return { ...state, coManagers: state.coManagers.filter(element => action.payload != element.id) };
     
    if (action.type === Type.GetCoManagers)
        return { ...state, coManagers: action.payload };

    if (action.type === Type.EditCoManager)
        return { ...state, coManagers: state.coManagers.map(el => el.id === action.payload.id ? action.payload : el) }
        
    if (action.type === Type.FindCoManager)
        return { ...state, selectedCManager: state.coManagers.find(x => x.id == action.payload) }

    if (action.type === LOGOUT)
        return INITIAL_STATE

    return state;

}