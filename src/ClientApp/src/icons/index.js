import React from "react";

export const headline = (md, mobile) => {
    return (
        <svg
            className={`md:w-${md} w-${mobile} md:h-${md} h-${mobile}`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-5h2v5zm4 0h-2v-3h2v3zm0-5h-2v-2h2v2zm4 5h-2V7h2v10z"/>
        </svg>
    );
}

export const home = (md, mobile) => {
    return (
        <svg
            className={`md:w-${md} w-${mobile} md:h-${md} h-${mobile}`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff">
            <path d="M0 0h24v24H0z" fill="none"/><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
    );
}

export const bases = (md, mobile) => {
    return (
        <svg
            className={`md:w-${md} w-${mobile} md:h-${md} h-${mobile}`}
            xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#fff">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M6 5H3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zm14 0h-3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zm-7 0h-3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1z"/>
        </svg>
    );
}

export const courses = (md, mobile, color) => {
    return (
        <svg
            className={`md:w-${md} w-${mobile} md:h-${md} h-${mobile}`}
            xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill={`${color}`}>
            <path d="M0 0h24v24H0z" fill="none"/><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
        </svg>
    );
}

export const teachers = (md, mobile) => {
    return (
        <svg
            className={`md:w-${md} w-${mobile} md:h-${md} h-${mobile}`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff">
            <path d="M0 0h24v24H0z" fill="none"/><path d="M11.99 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm3.61 6.34c1.07 0 1.93.86 1.93 1.93 0 1.07-.86 1.93-1.93 1.93-1.07 0-1.93-.86-1.93-1.93-.01-1.07.86-1.93 1.93-1.93zm-6-1.58c1.3 0 2.36 1.06 2.36 2.36 0 1.3-1.06 2.36-2.36 2.36s-2.36-1.06-2.36-2.36c0-1.31 1.05-2.36 2.36-2.36zm0 9.13v3.75c-2.4-.75-4.3-2.6-5.14-4.96 1.05-1.12 3.67-1.69 5.14-1.69.53 0 1.2.08 1.9.22-1.64.87-1.9 2.02-1.9 2.68zM11.99 20c-.27 0-.53-.01-.79-.04v-4.07c0-1.42 2.94-2.13 4.4-2.13 1.07 0 2.92.39 3.84 1.15-1.17 2.97-4.06 5.09-7.45 5.09z"/>
        </svg>
    );
}

export const students = (md, mobile) => {
    return (
        <svg
            className={`md:w-${md} w-${mobile} md:h-${md} h-${mobile}`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff">
            <path d="M0 0h24v24H0z" fill="none"/><path d="M16.5 13c-1.2 0-3.07.34-4.5 1-1.43-.67-3.3-1-4.5-1C5.33 13 1 14.08 1 16.25V19h22v-2.75c0-2.17-4.33-3.25-6.5-3.25zm-4 4.5h-10v-1.25c0-.54 2.56-1.75 5-1.75s5 1.21 5 1.75v1.25zm9 0H14v-1.25c0-.46-.2-.86-.52-1.22.88-.3 1.96-.53 3.02-.53 2.44 0 5 1.21 5 1.75v1.25zM7.5 12c1.93 0 3.5-1.57 3.5-3.5S9.43 5 7.5 5 4 6.57 4 8.5 5.57 12 7.5 12zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 5.5c1.93 0 3.5-1.57 3.5-3.5S18.43 5 16.5 5 13 6.57 13 8.5s1.57 3.5 3.5 3.5zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
        </svg>
    );
}

export const logout = (md, mobile) => {
    return (
        <svg
            className={`md:w-${md} w-${mobile} md:h-${md} h-${mobile}`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff">
            <path d="M0 0h24v24H0z" fill="none"/><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
        </svg>
    );
}

export const list = (md, mobile) => {
    return (
        <svg
            className={`md:w-${md} w-${mobile} md:h-${md} h-${mobile}`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000">
            <path d="M0 0h24v24H0z" fill="none"/><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
        </svg>
    );
}

export const remove = (md, mobile) => {
    return (
        <svg
            className={`md:w-${md} w-${mobile} md:h-${md} h-${mobile}`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000">
            <path d="M0 0h24v24H0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
    );
}

export const edit = (md, mobile) => {
    return (
        <svg
            className={`md:w-${md} w-${mobile} md:h-${md} h-${mobile}`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000">
            <path d="M0 0h24v24H0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
    );
}

export const add = (md, mobile, color) => {
    return (
        <svg
            className={`md:w-${md} w-${mobile} md:h-${md} h-${mobile}`} fill={`${color}`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
        </svg>
    );
}
