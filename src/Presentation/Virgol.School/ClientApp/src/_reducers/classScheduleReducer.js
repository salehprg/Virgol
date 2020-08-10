import * as Type from "../_actions/classScheduleTypes";
import {LOGOUT} from "../_actions/authTypes";

const INITIAL_STATE = {
    classSchedules : []
}

export default ( state = INITIAL_STATE, action ) => {

    switch (action.type) {
        case Type.getClassSchedule:
            return { ...state, classSchedules: action.payload };

        case Type.getTeacherSchedule:
            return { ...state, classSchedules: action.payload };
    
        case Type.AddClassSchedule:
            return { ...state, classSchedules: [...state.classSchedules, action.payload] };
            
        case Type.EditClassSchedule:
            return { ...state, classSchedules: state.classSchedules.map(el => el.id === action.payload.id ? action.payload : el) }

        case Type.DeleteClassSchedule:
            return { ...state, classSchedules: state.classSchedules.filter(element => element.id != action.payload) }
            
        default: return state

    }

}