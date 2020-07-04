const INITIAL_STATE = {
    'newUsers' : null,
    'categories': null,
    'courses': null,
    'teachers' : null,
    'students' : null,
}

export default (state = INITIAL_STATE, action) => {

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

    if (action.type === 'ADD_NEW_CATEGORY')
        return { ...state, categories: [...state.categories, action.payload]};

    if (action.type === 'ADD_NEW_TEACHER')
        return { ...state, teachers: [...state.teachers, action.payload]};

    if (action.type === 'DELETE_CATEGORY')
        return { ...state, categories: state.categories.filter(element => element.id !== action.payload) }

    if (action.type === 'LOGOUT')
        return INITIAL_STATE

    return state;

}