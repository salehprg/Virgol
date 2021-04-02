import * as Type from '../_actions/guideTypes'

const INITIAL_STATE = {
    teacherLinks : [] ,
    studentLinks : [] ,
    principalLinks : []
}

export default (state = INITIAL_STATE , action) =>{
    switch (action.type) {
        case Type.getPrincipalLinks:
            return {...state , principalLinks : action.payload}
        case Type.getTeacherLinks :
            return{...state , teacherLinks : action.payload}
        case Type.getStudentLinks:
            return {...state , studentLinks : action.payload}
        default:
            return state
    }
}