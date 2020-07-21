import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from "./authReducer";
import errorsReducer from "./errorsReducer";
import loadingReducer from "./loadingReducer";
import adminReducer from "./adminReducer";
import successReducer from "./successReducer";
import alertReducer from "./alertReducer";
import userReducer from "./userReducer";
import managerReducer from "./managerReducer";

export default combineReducers({
    auth: authReducer,
    managerData: managerReducer,
    adminData: adminReducer,
    userInfo: userReducer,
    form: formReducer,
    alert: alertReducer,
    error: errorsReducer,
    success: successReducer,
    loading: loadingReducer
});