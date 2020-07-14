const INITIAL_STATE = {
    'newUsers' : null,
    'categories': null,
    'courses': null,
    'teachers' : null,
    'students' : null,
    'catInfo': null
}

export default (state = INITIAL_STATE, action) => {

    if (action.type === 'CONFIRM')
        return { ...state, newUsers: state.newUsers.filter(element => element.id !== action.payload) };

    if (action.type === 'GET_NEW_USERS')
        return { ...state, newUsers: action.payload };

    if (action.type === 'GET_ALL_CATEGORY')
        return { ...state, categories: action.payload };

    if (action.type === 'GET_ALL_COURSES')
        return { ...state, courses: action.payload };

    if (action.type === 'GET_ALL_TEACHERS')
        return { ...state, teachers: action.payload };

    if (action.type === 'GET_ALL_STUDENTS')
        return { ...state, students: action.payload };

    if (action.type === 'GET_CAT_INFO')
        return { ...state, catInfo: action.payload };

    if (action.type === 'ADD_NEW_CATEGORY')
        return { ...state, categories: [...state.categories, action.payload]};

    if (action.type === 'ADD_NEW_TEACHER')
        return { ...state, teachers: [...state.teachers, action.payload]};

    if (action.type === 'DELETE_CATEGORY')
        return { ...state, categories: state.categories.filter(element => element.id !== action.payload) }

    if (action.type === 'ADD_NEW_COURSE')
        return { ...state, courses: [...state.courses, action.payload]};

    if (action.type === 'ADD_COURSES_TO_CAT')
        return { ...state, catInfo: [...state.catInfo, action.payload]};

    if (action.type === 'ADD_NEW_COURSE')
        return { ...state, catInfo: [...state.catInfo, action.payload]};

    if (action.type === 'DELETE_COURSE')
        return { ...state,
            courses: state.courses.filter(element => element.id !== action.payload),
            catInfo: state.catInfo.filter(element => element.id !== action.payload)
    }

    if (action.type === 'DELETE_TEACHER')
        return { ...state, teachers: state.teachers.filter(element => element.id !== action.payload) }

    if (action.type === 'EDIT_CATEGORY')
        return { ...state, categories: state.categories.map(el => el.id === action.payload.id ? action.payload : el) }

    if (action.type === 'EDIT_TEACHER')
        return { ...state, teachers: state.teachers.map(el => el.id === action.payload.id ? action.payload : el) }

    if (action.type === 'WIPE_CAT_INFO')
        return { ...state, catInfo: null }

    if (action.type === 'LOGOUT')
        return INITIAL_STATE

    return state;

}