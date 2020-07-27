import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from "./authReducer";
import errorsReducer from "./errorsReducer";
import loadingReducer from "./loadingReducer";
import adminReducer from "./managerReducer";
import successReducer from "./successReducer";
import alertReducer from "./alertReducer";
import userReducer from "./userReducer";
import workingReducer from "./workingReducer";

export default combineReducers({
    auth: authReducer,
    managerData: adminReducer,
    userInfo: userReducer,
    form: formReducer,
    alert: alertReducer,
    worker: workingReducer,
    error: errorsReducer,
    success: successReducer,
    loading: loadingReducer
});