import * as Type from '../_actions/managerTypes'
import { LOGOUT } from "../_actions/authTypes";

const INITIAL_STATE = {
    'newUsers' : [],
    'inNews': [],
    myNews: [],
    schoolLessonInfo : null,
    'accessRoleIds': [],
    grades: [],
    'classes': [],
    teachers : [],
    students : [],
    'catInfo': [],
    dashboardInfo : {}
}

export default (state = INITIAL_STATE, action) => {

    if (action.type === Type.getManagerDashboardInfo)
        return { ...state, dashboardInfo: action.payload };

    if (action.type === Type.CONFIRM)
        return { ...state, newUsers: state.newUsers.filter(element => element.id !== action.payload) };

    if (action.type === Type.GET_NEW_USERS)
        return { ...state, newUsers: action.payload };

//#region Grades/Class


//#endregion

    if (action.type === Type.GET_ALL_TEACHERS)
        return { ...state, teachers: action.payload };

    if (action.type === Type.GET_ALL_STUDENTS)
        return { ...state, students: action.payload };

    if (action.type === Type.getStudentsClass)
        return { ...state, studentsInClass: action.payload };

    if (action.type === Type.ADD_NEW_TEACHER)
        return { ...state, teachers: [...state.teachers, action.payload]};

    if (action.type === 'DELETE_CATEGORY')
        return { ...state, categories: state.categories.filter(element => element.id !== action.payload) }

    if (action.type === Type.DELETE_TEACHER)
        return { ...state, teachers: state.teachers.filter(element => !action.payload.includes(element.id)) }

    if (action.type === Type.EDIT_TEACHER)
        return { ...state, teachers: state.teachers.map(el => el.id === action.payload.id ? action.payload : el) }

    if (action.type === Type.WIPE_CAT_INFO)
        return { ...state, catInfo: null }

    if (action.type === LOGOUT)
        return INITIAL_STATE

    return state;

}