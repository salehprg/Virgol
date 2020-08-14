import * as Type from "../_actions/adminTypes";
import {LOGOUT} from "../_actions/authTypes";

const INITIAL_STATE = {
    news : [],
    dashboardInfo : [],
    schools: [],
    createSchoolData : {},
    schoolLessonInfo : null,
    newSchoolInfo : {
        bases : [],
        studyFields : [],
        grades: [] ,
        lessons : []
    }
}

export default ( state = INITIAL_STATE, action ) => {

    switch (action.type) {

        case Type.GetAllStudents: 
            return { ...state, allStudents: action.payload}

        case Type.GetAllTeachers: 
            return { ...state, allTeachers: action.payload}

        case Type.GetManagers: 
            return { ...state, managers: action.payload}

        case Type.AddNewManager: 
            return { ...state, managers: [...state.managers, action.payload]};

        case Type.EditManager: 
            return { ...state, managers: state.managers.map(el => el.id === action.payload.id ? action.payload : el) }

        case Type.RemoveManager: 
            return { ...state, managers: state.managers.filter(element => !action.payload.includes(element.id)) }

        case Type.getDashboardInfo: 
            return { ...state, dashboardInfo: action.payload}

        case Type.RedirectAdmin: 
            return { ...state, managerInfo: action.payload}

        case LOGOUT: 
            return INITIAL_STATE
            
        default: return state

    }

}