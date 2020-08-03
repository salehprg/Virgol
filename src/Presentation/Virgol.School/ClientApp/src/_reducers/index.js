import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import alertReducer from "./alertReducer";
import workerReducer from "./workerReducer";
import authReducer from "./authReducer";

export default combineReducers({
    auth: authReducer,
    form: formReducer,
    alert: alertReducer,
    worker: workerReducer
});