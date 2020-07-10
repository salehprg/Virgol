import React from "react";

export const loading = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg"
            version="1.0" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="12"/>
            <g><circle cx="108.5" cy="89.75" r="12.5" />
            <circle cx="108.5" cy="89.75" r="12.5" transform="rotate(180 64 64)"/>
            <animateTransform attributeName="transform" type="rotate" from="0 64 64" to="180 64 64" dur="1080ms" repeatCount="indefinite">
            </animateTransform></g>
        </svg>
    );
}

export const fingerprint = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12zM14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1-1.4-1.39-2.17-3.24-2.17-5.22 0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29-.49-1.31-.73-2.61-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38z"/>
        </svg>
    );
}

export const lock = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
        </svg>
    );
}

export const headline = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 15h16v-2H4v2zm0 4h16v-2H4v2zm0-8h16V9H4v2zm0-6v2h16V5H4z"/>
        </svg>
    );
}

export const clear = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
    );
}

export const home = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
    );
}

export const base = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M6 5H3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zm14 0h-3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zm-7 0h-3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1z"/>
        </svg>
    );
}

export const book = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
        </svg>
    );
}

export const teachers = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M11.99 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm3.61 6.34c1.07 0 1.93.86 1.93 1.93 0 1.07-.86 1.93-1.93 1.93-1.07 0-1.93-.86-1.93-1.93-.01-1.07.86-1.93 1.93-1.93zm-6-1.58c1.3 0 2.36 1.06 2.36 2.36 0 1.3-1.06 2.36-2.36 2.36s-2.36-1.06-2.36-2.36c0-1.31 1.05-2.36 2.36-2.36zm0 9.13v3.75c-2.4-.75-4.3-2.6-5.14-4.96 1.05-1.12 3.67-1.69 5.14-1.69.53 0 1.2.08 1.9.22-1.64.87-1.9 2.02-1.9 2.68zM11.99 20c-.27 0-.53-.01-.79-.04v-4.07c0-1.42 2.94-2.13 4.4-2.13 1.07 0 2.92.39 3.84 1.15-1.17 2.97-4.06 5.09-7.45 5.09z"/>
        </svg>
    );
}

export const students = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M16.5 13c-1.2 0-3.07.34-4.5 1-1.43-.67-3.3-1-4.5-1C5.33 13 1 14.08 1 16.25V19h22v-2.75c0-2.17-4.33-3.25-6.5-3.25zm-4 4.5h-10v-1.25c0-.54 2.56-1.75 5-1.75s5 1.21 5 1.75v1.25zm9 0H14v-1.25c0-.46-.2-.86-.52-1.22.88-.3 1.96-.53 3.02-.53 2.44 0 5 1.21 5 1.75v1.25zM7.5 12c1.93 0 3.5-1.57 3.5-3.5S9.43 5 7.5 5 4 6.57 4 8.5 5.57 12 7.5 12zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 5.5c1.93 0 3.5-1.57 3.5-3.5S18.43 5 16.5 5 13 6.57 13 8.5s1.57 3.5 3.5 3.5zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
        </svg>
    );
}

export const logoutIcon = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
        </svg>
    );
}

export const check = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g>
                <rect fill="none" height="24" width="24"/>
            </g>
            <g><g>
                <circle cx="10" cy="8" r="4"/>
                <path d="M10.35,14.01C7.62,13.91,2,15.27,2,18v2h9.54C9.07,17.24,10.31,14.11,10.35,14.01z"/>
                <path d="M19.43,18.02C19.79,17.43,20,16.74,20,16c0-2.21-1.79-4-4-4s-4,1.79-4,4c0,2.21,1.79,4,4,4c0.74,0,1.43-0.22,2.02-0.57 L20.59,22L22,20.59L19.43,18.02z M16,18c-1.1,0-2-0.9-2-2c0-1.1,0.9-2,2-2s2,0.9,2,2C18,17.1,17.1,18,16,18z"/>
            </g></g>
        </svg>
    );
}

export const edit = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
    );
}

export const remove = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
    );
}

export const errorOutline = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
        </svg>
    );
}

export const upload = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
        </svg>
    );
}

export const uploadDone = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17 15.18 9l1.41 1.41L10 17z"/>
        </svg>
    );
}

export const face = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z"/>
        </svg>
    );
}

export const person = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
    );
}

export const verified = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g><rect fill="none" height="24" width="24"/></g>
            <g><path d="M23,12l-2.44-2.79l0.34-3.69l-3.61-0.82L15.4,1.5L12,2.96L8.6,1.5L6.71,4.69L3.1,5.5L3.44,9.2L1,12l2.44,2.79l-0.34,3.7 l3.61,0.82L8.6,22.5l3.4-1.47l3.4,1.46l1.89-3.19l3.61-0.82l-0.34-3.69L23,12z M10.09,16.72l-3.8-3.81l1.48-1.48l2.32,2.33 l5.85-5.87l1.48,1.48L10.09,16.72z"/></g>
        </svg>
    );
}

export const heart = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
    );
}

export const eye = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
    );
}

export const add = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
        </svg>
    );
}

export const arrow = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
    );
}

export const doubleArrow = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g><rect fill="none" height="24" width="24"/></g><g><g><polygon points="15.5,5 11,5 16,12 11,19 15.5,19 20.5,12"/>
            <polygon points="8.5,5 4,5 9,12 4,19 8.5,19 13.5,12"/></g></g>
        </svg>
    );
}

export const bookInfo = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <g id="background">
                <rect fill="none" height="32" width="32"/>
            </g>
            <g id="book_x5F_text_x5F_information">
                <path d="M32,23.001c0-3.917-2.506-7.24-5.998-8.477V4h-2V1.999h2V0h-23C2.918,0.004,2.294-0.008,1.556,0.354   C0.808,0.686-0.034,1.645,0.001,3c0,0.006,0.001,0.012,0.001,0.018V30c0,2,2,2,2,2h21.081l-0.007-0.004   C28.013,31.955,32,27.946,32,23.001z M2.853,3.981C2.675,3.955,2.418,3.869,2.274,3.743C2.136,3.609,2.017,3.5,2.002,3   c0.033-0.646,0.194-0.686,0.447-0.856c0.13-0.065,0.289-0.107,0.404-0.125C2.97,1.997,3,2.005,3.002,1.999h19V4h-19   C3,4,2.97,4.002,2.853,3.981z M4,30V6h20v8.06C23.671,14.023,23.337,14,22.998,14c-2.142,0-4.106,0.751-5.651,2H6v2h9.516   c-0.413,0.616-0.743,1.289-0.995,2H6v2h8.057c-0.036,0.329-0.059,0.662-0.059,1.001c0,2.829,1.307,5.35,3.348,6.999H4z M23,30   c-3.865-0.008-6.994-3.135-7-6.999c0.006-3.865,3.135-6.995,7-7.001c3.865,0.006,6.992,3.136,7,7.001   C29.992,26.865,26.865,29.992,23,30z M22,12H6v2h16V12z"/>
                <path d="M22,28h2v-6h-2V28z M22,18v2h2v-2H22z"/>
            </g>
        </svg>
    );
}

export const addPerson = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M9,14c1.381,0,2.631-0.56,3.536-1.465C13.44,11.631,14,10.381,14,9s-0.56-2.631-1.464-3.535C11.631,4.56,10.381,4,9,4  S6.369,4.56,5.464,5.465C4.56,6.369,4,7.619,4,9s0.56,2.631,1.464,3.535C6.369,13.44,7.619,14,9,14z"/>
            <path d="M9,21c3.518,0,6-1,6-2c0-2-2.354-4-6-4c-3.75,0-6,2-6,4C3,20,5.25,21,9,21z"/>
            <path d="M21,12h-2v-2c0-0.553-0.447-1-1-1s-1,0.447-1,1v2h-2c-0.553,0-1,0.447-1,1s0.447,1,1,1h2v2c0,0.553,0.447,1,1,1s1-0.447,1-1  v-2h2c0.553,0,1-0.447,1-1S21.553,12,21,12z"/>
        </svg>
    );
}

export const teaching = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
            <path d=" M 87.8 19 L 23.8 19 C 21.6 19 19.8 20.8 19.8 23 L 19.8 37.5 C 20.9 37.2 22.2 37 23.4 37 C 24.2 37 25 37.1 25.8 37.2 L 25.8 25 L 85.8 25 L 85.8 63 L 51.9 63 L 46.2 69 L 87.8 69 C 90 69 91.8 67.2 91.8 65 L 91.8 23 C 91.8 20.8 90 19 87.8 19"/>
            <path d=" M 23.5 58 C 28.2 58 32 54.2 32 49.5 C 32 44.8 28.2 41 23.5 41 C 18.8 41 15 44.8 15 49.5 C 14.9 54.2 18.8 58 23.5 58"/>
            <path d=" M 56.2 48.1 C 54.9 46.1 52.3 45.6 50.3 46.8 C 49.9 47 49.7 47.4 49.5 47.6 L 34.9 62.8 C 33.5 62.1 32 61.5 30.5 61 C 28.2 60.6 25.8 60.1 23.5 60.1 C 21.2 60.1 18.8 60.5 16.5 61.2 C 13.1 62.1 10.1 63.8 7.6 65.9 C 7 66.5 6.5 67.4 6.3 68.2 L 4.2 77 L 34.1 77 L 34.1 76.9 L 42.6 67 L 55.7 53.2 C 56.9 52 57.3 49.7 56.2 48.1"/>
        </svg>
    );
}

export const excel = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            viewBox="0 0 512 512"  xmlns="http://www.w3.org/2000/svg">
            <path d="M476.624,97.457H289.746v57.656h43.131c7.934,0,14.371,6.458,14.371,14.413     c0.001,7.957-6.438,14.415-14.371,14.415h-43.131v28.831h43.131c7.934,0,14.371,6.458,14.371,14.408     c0.001,7.96-6.438,14.417-14.371,14.417h-43.131v28.828h43.131c7.934,0,14.371,6.457,14.371,14.415     c0.001,7.951-6.438,14.409-14.371,14.409h-43.131v28.832h43.131c7.934,0,14.371,6.458,14.371,14.417     c0,7.956-6.438,14.412-14.371,14.412h-43.131v57.653h186.878c7.938,0,14.376-6.455,14.375-14.416V111.87     C490.999,103.913,484.562,97.457,476.624,97.457z M419.125,356.909h-28.75c-7.934,0-14.377-6.456-14.377-14.412     c0-7.959,6.443-14.417,14.377-14.417h28.75c7.933,0,14.373,6.458,14.373,14.417C433.498,350.453,427.058,356.909,419.125,356.909     z M419.125,299.248h-28.75c-7.934,0-14.377-6.458-14.377-14.409c0-7.958,6.443-14.415,14.377-14.415h28.75     c7.933,0,14.373,6.457,14.373,14.415C433.498,292.79,427.058,299.248,419.125,299.248z M419.125,241.596h-28.75     c-7.934,0-14.377-6.457-14.377-14.417c0-7.95,6.443-14.408,14.377-14.408h28.75c7.933,0,14.373,6.458,14.373,14.408     C433.498,235.139,427.058,241.596,419.125,241.596z M419.125,183.939h-28.75c-7.934,0-14.377-6.458-14.377-14.415     c0-7.955,6.443-14.413,14.377-14.413h28.75c7.933,0,14.373,6.458,14.373,14.413C433.498,177.482,427.058,183.939,419.125,183.939     z"/>
            <path d="M274.548,43.115c-3.282-2.738-7.681-3.922-11.819-3.053L32.731,83.3     c-6.814,1.275-11.73,7.211-11.73,14.157v317.106c0,6.919,4.916,12.883,11.73,14.157l229.997,43.24     c0.862,0.17,1.754,0.259,2.646,0.259c3.334,0,6.582-1.152,9.172-3.318c3.309-2.734,5.199-6.828,5.199-11.099v-43.239v-57.653     V328.08v-28.832v-28.824v-28.828v-28.826v-28.831v-28.827V97.457V54.219C279.745,49.921,277.854,45.855,274.548,43.115z      M217.338,324.504c-2.732,2.395-6.1,3.578-9.466,3.578c-3.992,0-7.96-1.675-10.809-4.954l-41.799-47.891l-36.659,47.277     c-2.843,3.665-7.071,5.565-11.354,5.565c-3.073,0-6.21-0.98-8.857-3.025c-6.236-4.898-7.388-13.953-2.499-20.241l40.078-51.657     l-39.532-45.317c-5.232-5.97-4.627-15.078,1.351-20.32c5.923-5.25,15.01-4.703,20.269,1.357l35.88,41.102l42.583-54.889     c4.909-6.253,13.938-7.407,20.176-2.504c6.238,4.896,7.395,13.95,2.507,20.238l-45.978,59.271l45.46,52.088     C223.918,310.152,223.316,319.262,217.338,324.504z"/>
        </svg>
    );
}

export const glasses = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <path d="M465.4,247c-2.2-22-12.4-43-28.9-58.4c-17.1-15.9-39.3-24.7-62.7-24.7c-41.5,0-77.3,27.4-88.5,67c-7-7-18.5-11.7-29.3-11.7  c-10.8,0-22.3,4.7-29.3,11.7c-11.2-39.6-47-67-88.5-67c-23.3,0-45.6,8.7-62.7,24.6C59,204,48.8,225,46.6,247H32v18h14.6  c2.2,22,12.4,43,28.9,58.4c17.1,15.9,39.3,24.7,62.7,24.7c50.8,0,92.1-41.2,92.1-92c0-0.1,0-0.1,0-0.1h0c0-9.9,11.5-21.6,25.7-21.6  s25.7,11.7,25.7,21.6h0c0,0,0,0,0,0.1c0,50.8,41.3,92,92.1,92c23.3,0,45.6-8.7,62.7-24.7c16.5-15.4,26.7-36.5,28.9-58.5H480v-18  H465.4z M373.8,333c-42.5,0-77-34.6-77-77c0-42.5,34.6-77,77-77c42.5,0,77,34.6,77,77C450.8,298.5,416.3,333,373.8,333z M138.2,333  c-42.5,0-77-34.6-77-77c0-42.5,34.6-77,77-77c42.5,0,77,34.6,77,77C215.2,298.5,180.7,333,138.2,333z"/>
        </svg>
    );
}

export const circle = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <circle cx="12" cy="12" r="10"/>
        </svg>
    );
}

export const locationIcon = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
    );
}

export const account = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
    );
}

export const school = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
        </svg>
    );
}

export const phone = (styles) => {
    return (
        <svg
            className={`${styles} fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M17 1.01L7 1c-1.1 0-1.99.9-1.99 2v18c0 1.1.89 2 1.99 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
        </svg>
    );
}