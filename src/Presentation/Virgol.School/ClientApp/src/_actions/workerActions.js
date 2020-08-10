import { START, STOP } from "./workerTypes";

const start = () => {
    return { type: START }
}

const stop = () => {
    return { type: STOP }
}

export const worker = {
    start,
    stop
}