import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from "./authReducer";
import errorsReducer from "./errorsReducer";
import loadingReducer from "./loadingReducer";
import adminReducer from "./adminReducer";
import successReducer from "./successReducer";

export default combineReducers({
    auth: authReducer,
    adminData: adminReducer,
    form: formReducer,
    error: errorsReducer,
    success: successReducer,
    loading: loadingReducer
});