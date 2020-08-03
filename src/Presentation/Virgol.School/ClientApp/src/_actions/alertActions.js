import { CLEAR, ERROR, SUCCESS } from "./alertTypes";

const success = (message) => {
    return { type: SUCCESS, payload: message }
}

const error = (message) => {
    return { type: ERROR, payload: message }
}

const clear = () => {
    return { type: CLEAR }
}

export const alert = {
    success,
    error,
    clear
}