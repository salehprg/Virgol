import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import alertReducer from "./alertReducer";
import adminReducer from "./adminReducer";
import workerReducer from "./workerReducer";
import authReducer from "./authReducer";
import managerReducer from "./managerReducer";

export default combineReducers({
    managerData: managerReducer,
    adminData: adminReducer,
    auth: authReducer,
    form: formReducer,
    alert: alertReducer,
    worker: workerReducer
});