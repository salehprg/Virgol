import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from "./authReducer";
import errorsReducer from "./errorsReducer";
import loadingReducer from "./loadingReducer";
import adminReducer from "./adminReducer";

export default combineReducers({
    auth: authReducer,
    adminData: adminReducer,
    form: formReducer,
    error: errorsReducer,
    loading: loadingReducer
});