import * as Type from "../_actions/adminTypes";
import {LOGOUT} from "../_actions/authTypes";

const INITIAL_STATE = {
    news : [],
    dashboardInfo : [],
    schools: [],
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

        case Type.GetNews: 
            return { ...state, news: action.payload}

        case Type.CreateNews: 
            return { ...state, news: [...state.news, action.payload]};

        case Type.EditNews: 
            return { ...state, news: state.news.map(el => el.id === action.payload.id ? action.payload : el) }

        case Type.RemoveNews: 
            return { ...state, news: state.news.filter(element => !action.payload.includes(element.id)) }

        case Type.GetManagers: 
            return { ...state, managers: action.payload}

        case Type.AddNewManager: 
            return { ...state, managers: [...state.managers, action.payload]};

        case Type.EditManager: 
            return { ...state, managers: state.managers.map(el => el.id === action.payload.id ? action.payload : el) }

        case Type.RemoveManager: 
            return { ...state, managers: state.managers.filter(element => !action.payload.includes(element.id)) }

        case Type.GetSchoolInfo: 
            return { ...state, schoolLessonInfo: action.payload}

        case Type.GetSchools: 
            return { ...state, schools: action.payload}

        case Type.CreateSchool: 
            return { ...state, schools: [...state.schools , action.payload]};

        case Type.AddBaseToSchool: 
            return { ...state, schoolLessonInfo: {...state.schoolLessonInfo , bases :  action.payload}}

        case Type.RemoveBaseFromSchool: 
            return { ...state, schoolLessonInfo: state.schoolLessonInfo.bases.filter(element => !action.payload.includes(element.id))};

        case Type.AddStudyFToSchool: 
            return { ...state, schoolLessonInfo: {...state.schoolLessonInfo , studyFields : action.payload}};

        case Type.RemoveStudyFFromSchool: 
            return { ...state, schoolLessonInfo: state.schoolLessonInfo.studyFields.filter(element => !action.payload.includes(element.id))};

        case Type.EditSchool: 
            return { ...state, schools: state.schools.map(el => el.id === action.payload.id ? action.payload : el) }

        case Type.RemoveSchool: 
            return { ...state, schools: state.schools.filter(element => !action.payload.includes(element.id)) }

        case Type.getDashboardInfo: 
            return { ...state, dashboardInfo: action.payload}

        case Type.GetBases: 
            return { ...state, newSchoolInfo : {...state.newSchoolInfo , bases : action.payload}}

        case Type.GetStudyFields: 
            return { ...state, newSchoolInfo : {...state.newSchoolInfo , studyFields : action.payload}}

        case Type.GetSchool_StudyFields: 
            return { ...state, schoolLessonInfo : {...state.schoolLessonInfo , studyFields : action.payload}}

        case Type.GetGrade: 
            return { ...state, newSchoolInfo : {...state.newSchoolInfo , grades : action.payload}}

        case Type.GetSchool_Grades: 
            return { ...state, schoolLessonInfo : {...state.schoolLessonInfo , grades : action.payload}}
        
        case Type.GetLessons: 
            return { ...state, newSchoolInfo : {...state.newSchoolInfo , lessons : action.payload}}

        case LOGOUT: 
            return INITIAL_STATE
            
        default: return state

    }

}