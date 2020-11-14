import * as Type from "../_actions/schoolTypes";
import {LOGOUT} from "../_actions/authTypes";

const INITIAL_STATE = {
    news : [],
    dashboardInfo : [],
    commonLessons : [],
    schools: [],
    classes : [],
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
        case Type.getGrades:
            return { ...state, grades: action.payload };
            
//#region Class
        case Type.getAllClass:
            return { ...state, allClass: action.payload };

        case Type.ClassList:
            return { ...state, classes: action.payload };

        case Type.AddNewClass:
            return { ...state, classes: [...state.classes, action.payload] , allClass: [...state.allClass, action.payload]};

        case Type.EditClass:
            return { ...state, classes: state.classes.map(el => el.id === action.payload.id ? action.payload : el) }

        case Type.DeleteClass:
            return { ...state, classes: state.classes.filter(element => !action.payload.includes(element.id)) }
//#endregion

        case Type.GetSchoolInfo: 
            return { ...state, schoolLessonInfo: action.payload}

        case Type.GetSchools: 
            return { ...state, schools: action.payload}

        case Type.CreateSchool: 
            return { ...state, CreateSchool: action.payload};

        case Type.EditSchool: 
            return { ...state, schools: state.schools.map(el => el.id === action.payload.id ? action.payload : el) }

        case Type.RemoveSchool: 
            return { ...state, schools: state.schools.filter(element => element.id != action.payload) }


//#region Base
        case Type.GetBases: 
            return { ...state, newSchoolInfo : {...state.newSchoolInfo , bases : action.payload}}

        case Type.AddBaseToSchool: 
            return { ...state, schoolLessonInfo: {...state.schoolLessonInfo , bases :  action.payload}}

        case Type.RemoveBaseFromSchool: 
            return { ...state, schoolLessonInfo: {...state.schoolLessonInfo, bases: state.schoolLessonInfo.bases.filter(element => element.id !== action.payload)}};
//#endregion

//#region StudyField
        case Type.GetStudyFields: 
            return { ...state, newSchoolInfo : {...state.newSchoolInfo , studyFields : action.payload}}

        case Type.GetSchool_StudyFields: 
            return { ...state, schoolLessonInfo : {...state.schoolLessonInfo , studyFields : action.payload , grades : []}}

        case Type.AddStudyFToSchool: 
            return { ...state, schoolLessonInfo: {...state.schoolLessonInfo , studyFields : action.payload , grades : []}};

        case Type.RemoveStudyFFromSchool: 
            return { ...state, schoolLessonInfo: {...state.schoolLessonInfo, studyFields: state.schoolLessonInfo.studyFields.filter(element => element.id !== action.payload)}};
//#endregion

        case Type.GetGrade: 
            return { ...state, newSchoolInfo : {...state.newSchoolInfo , grades : action.payload}}

        case Type.GetSchool_Grades: 
            return { ...state, schoolLessonInfo : {...state.schoolLessonInfo , grades : action.payload}}
        
        case Type.GetLessons: 
            return { ...state, newSchoolInfo : {...state.newSchoolInfo , lessons : action.payload}}

        case Type.GetClassesCommonLessons: 
            return { ...state, commonLessons :  action.payload}


        case LOGOUT: 
            return INITIAL_STATE
            
        default: return state

    }

}