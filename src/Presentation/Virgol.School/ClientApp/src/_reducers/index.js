import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import alertReducer from "./alertReducer";
import adminReducer from "./adminReducer";
import workerReducer from "./workerReducer";
import authReducer from "./authReducer";
import managerReducer from "./managerReducer";
import schoolReducer from "./schoolReducer";
import newsReducer from "./newsReducer";
import classScheduleReducer from "./classScheduleReducer";

export default combineReducers({
    schedules: classScheduleReducer,
    newsData: newsReducer,
    schoolData: schoolReducer,
    managerData: managerReducer,
    adminData: adminReducer,
    auth: authReducer,
    form: formReducer,
    alert: alertReducer,
    worker: workerReducer
});