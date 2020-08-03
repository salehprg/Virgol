import { START, STOP } from "./workerTypes";

const start = (message) => {
    return { type: START }
}

const stop = (message) => {
    return { type: STOP }
}

export const worker = {
    start,
    stop
}