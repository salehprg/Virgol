import React from "react";

export const loading = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <rect x="17.5" y="27" width="15" height="46">
                <animate attributeName="y" repeatCount="indefinite" dur="0.9345794392523364s" calcMode="spline" keyTimes="0;0.5;1" values="15.5;27;27" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.18691588785046728s"/>
                <animate attributeName="height" repeatCount="indefinite" dur="0.9345794392523364s" calcMode="spline" keyTimes="0;0.5;1" values="69;46;46" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.18691588785046728s"/>
            </rect>
            <rect x="42.5" y="27" width="15" height="46">
                <animate attributeName="y" repeatCount="indefinite" dur="0.9345794392523364s" calcMode="spline" keyTimes="0;0.5;1" values="18.375;27;27" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.09345794392523364s"/>
                <animate attributeName="height" repeatCount="indefinite" dur="0.9345794392523364s" calcMode="spline" keyTimes="0;0.5;1" values="63.25;46;46" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.09345794392523364s"/>
            </rect>
            <rect x="67.5" y="27" width="15" height="46">
                <animate attributeName="y" repeatCount="indefinite" dur="0.9345794392523364s" calcMode="spline" keyTimes="0;0.5;1" values="18.375;27;27" keySplines="0 0.5 0.5 1;0 0.5 0.5 1"/>
                <animate attributeName="height" repeatCount="indefinite" dur="0.9345794392523364s" calcMode="spline" keyTimes="0;0.5;1" values="63.25;46;46" keySplines="0 0.5 0.5 1;0 0.5 0.5 1"/>
            </rect>
        </svg>
    );
}

export const translate = (styles) => {
    return (
        <svg 
        className={`${styles} tw-fill-current`}
        xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
    );
}

export const logo = (styles) => {
    return (
        <svg
            className={`tw-fill-current ${styles}`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.5 29.22">
            <path d="M29.4 7.31L25.13.11 16.74 0 8.37.11 4.1 7.31 0 14.61l4.1 7.3 4.27 7.21 8.37.09 8.38-.09 4.27-7.21 4.1-7.3-4.09-7.3zm-6.34-3.94c-.01.05-.03.11-.07.17-.03.06-.08.13-.15.2-.05.07-.15.16-.25.26-.12.09-.23.2-.36.3-.83.64-1.57 1.3-2.18 1.96-3.14 3.44-4.58 6.48-4.3 9.16v.15l1.12.18c1.28.2 2.28.63 2.99 1.3.72.67 1.17 1.56 1.34 2.67.35 2.28-.06 3.99-1.22 5.12-.59.59-1.24 1.01-1.96 1.25s-1.51.34-2.37.26c-3.84-.33-5.56-2.87-5.16-7.64.51-6.24 4.1-11.37 10.78-15.38.77-.46 1.25-.6 1.49-.4.07.05.13.09.18.15.05.05.08.08.09.11.01.03.02.05.03.07.02.03.02.06 0 .11z"/>
        </svg>
    );
}

export const sampadLogo = (styles) => {
    return (
        <svg
            className={`tw-fill-current ${styles}`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.5 29.22">
            <path d="M29.4 7.31L25.13.11 16.74 0 8.37.11 4.1 7.31 0 14.61l4.1 7.3 4.27 7.21 8.37.09 8.38-.09 4.27-7.21 4.1-7.3-4.09-7.3zm-6.34-3.94c-.01.05-.03.11-.07.17-.03.06-.08.13-.15.2-.05.07-.15.16-.25.26-.12.09-.23.2-.36.3-.83.64-1.57 1.3-2.18 1.96-3.14 3.44-4.58 6.48-4.3 9.16v.15l1.12.18c1.28.2 2.28.63 2.99 1.3.72.67 1.17 1.56 1.34 2.67.35 2.28-.06 3.99-1.22 5.12-.59.59-1.24 1.01-1.96 1.25s-1.51.34-2.37.26c-3.84-.33-5.56-2.87-5.16-7.64.51-6.24 4.1-11.37 10.78-15.38.77-.46 1.25-.6 1.49-.4.07.05.13.09.18.15.05.05.08.08.09.11.01.03.02.05.03.07.02.03.02.06 0 .11z"/>
        </svg>
    );
}

export const amoozeshRahdorLogo = (styles) => {
    return (
        <svg
            className={`tw-fill-current ${styles}`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.5 29.22">
            <path d="M29.4 7.31L25.13.11 16.74 0 8.37.11 4.1 7.31 0 14.61l4.1 7.3 4.27 7.21 8.37.09 8.38-.09 4.27-7.21 4.1-7.3-4.09-7.3zm-6.34-3.94c-.01.05-.03.11-.07.17-.03.06-.08.13-.15.2-.05.07-.15.16-.25.26-.12.09-.23.2-.36.3-.83.64-1.57 1.3-2.18 1.96-3.14 3.44-4.58 6.48-4.3 9.16v.15l1.12.18c1.28.2 2.28.63 2.99 1.3.72.67 1.17 1.56 1.34 2.67.35 2.28-.06 3.99-1.22 5.12-.59.59-1.24 1.01-1.96 1.25s-1.51.34-2.37.26c-3.84-.33-5.56-2.87-5.16-7.64.51-6.24 4.1-11.37 10.78-15.38.77-.46 1.25-.6 1.49-.4.07.05.13.09.18.15.05.05.08.08.09.11.01.03.02.05.03.07.02.03.02.06 0 .11z"/>
        </svg>
    );
}

export const alert_octagon = (styles) => {
    return (
        <svg
            className={`tw-fill-current ${styles}`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M16.1 23H7.9c-.3 0-.5-.1-.7-.3l-5.9-5.9c-.2-.1-.3-.4-.3-.7V7.9c0-.3.1-.5.3-.7l5.9-5.9c.1-.2.4-.3.7-.3h8.3c.3 0 .5.1.7.3l5.9 5.9c.1.1.2.4.2.7v8.3c0 .3-.1.5-.3.7l-5.9 5.9c-.1.1-.4.2-.7.2zm-7.8-2h7.5l5.3-5.3V8.3L15.7 3H8.3L3 8.3v7.5L8.3 21z"/>
            <path d="M12 13c-.6 0-1-.4-1-1V8c0-.6.4-1 1-1s1 .4 1 1v4c0 .6-.4 1-1 1zM12 17c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/>
        </svg>
    );
}

export const x = (styles) => {
    return (
        <svg
            className={`tw-fill-current ${styles}`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M6 19c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l12-12c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-12 12c-.2.2-.4.3-.7.3z"/>
            <path d="M18 19c-.3 0-.5-.1-.7-.3l-12-12c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l12 12c.4.4.4 1 0 1.4-.2.2-.4.3-.7.3z"/>
        </svg>
    );
}

export const working = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <g transform="translate(50 50)"><g>
                    <animateTransform attributeName="transform" type="rotate" values="0;45" keyTimes="0;1" dur="0.373134328358209s" repeatCount="indefinite"/>
                    <path d="M29.491524206117255 -5.5 L37.491524206117255 -5.5 L37.491524206117255 5.5 L29.491524206117255 5.5 A30 30 0 0 1 24.742744050198738 16.964569457146712 L24.742744050198738 16.964569457146712 L30.399598299691117 22.621423706639092 L22.621423706639096 30.399598299691114 L16.964569457146716 24.742744050198734 A30 30 0 0 1 5.5 29.491524206117255 L5.5 29.491524206117255 L5.5 37.491524206117255 L-5.499999999999997 37.491524206117255 L-5.499999999999997 29.491524206117255 A30 30 0 0 1 -16.964569457146705 24.742744050198738 L-16.964569457146705 24.742744050198738 L-22.621423706639085 30.399598299691117 L-30.399598299691117 22.621423706639092 L-24.742744050198738 16.964569457146712 A30 30 0 0 1 -29.491524206117255 5.500000000000009 L-29.491524206117255 5.500000000000009 L-37.491524206117255 5.50000000000001 L-37.491524206117255 -5.500000000000001 L-29.491524206117255 -5.500000000000002 A30 30 0 0 1 -24.742744050198738 -16.964569457146705 L-24.742744050198738 -16.964569457146705 L-30.399598299691117 -22.621423706639085 L-22.621423706639092 -30.399598299691117 L-16.964569457146712 -24.742744050198738 A30 30 0 0 1 -5.500000000000011 -29.491524206117255 L-5.500000000000011 -29.491524206117255 L-5.500000000000012 -37.491524206117255 L5.499999999999998 -37.491524206117255 L5.5 -29.491524206117255 A30 30 0 0 1 16.964569457146702 -24.74274405019874 L16.964569457146702 -24.74274405019874 L22.62142370663908 -30.39959829969112 L30.399598299691117 -22.6214237066391 L24.742744050198738 -16.964569457146716 A30 30 0 0 1 29.491524206117255 -5.500000000000013 M0 -20A20 20 0 1 0 0 20 A20 20 0 1 0 0 -20" fill="#707070" />
            </g></g>
        </svg>
    );
}

export const eye = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 21C4.5 21 .3 12.8.1 12.4c-.1-.3-.1-.6 0-.9C.3 11.2 4.5 3 12 3s11.7 8.2 11.9 8.6c.1.3.1.6 0 .9-.2.3-4.4 8.5-11.9 8.5zm-9.9-9c.9 1.6 4.5 7 9.9 7s8.9-5.4 9.9-7c-.9-1.6-4.5-7-9.9-7s-8.9 5.4-9.9 7z"/>
            <path d="M12 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
    );
}

export const eye_off = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 21C4.5 21 .3 12.8.1 12.4c-.1-.3-.1-.6 0-.9C1.4 9.1 3.2 7 5.5 5.3c.4-.4 1-.3 1.4.2.3.4.3 1.1-.2 1.4C4.8 8.3 3.3 10 2.1 12c.9 1.6 4.5 7 9.9 7 1.9 0 3.8-.7 5.3-1.9.4-.3 1.1-.2 1.4.2.3.4.2 1.1-.2 1.4-1.8 1.5-4.1 2.3-6.5 2.3zm8.8-4.8c-.2 0-.5-.1-.6-.2-.4-.4-.5-1-.1-1.4.7-.8 1.3-1.6 1.8-2.5-.9-1.6-4.5-7-9.9-7-.6 0-1.3.1-1.9.2-.5 0-1-.3-1.2-.8-.1-.6.2-1.1.8-1.2.7-.2 1.5-.3 2.3-.3 7.5 0 11.7 8.2 11.9 8.6.1.3.1.6 0 .9-.6 1.2-1.4 2.3-2.3 3.4-.2.2-.5.3-.8.3zm-8.9-.1c-1 0-2-.4-2.7-1.1-.8-.7-1.2-1.7-1.3-2.8 0-1.1.3-2.1 1.1-2.9l.2-.2c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-.1.1c-.4.4-.6.9-.5 1.4 0 .5.2 1 .6 1.4.4.4.9.6 1.4.5.5 0 1-.2 1.4-.6.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4-.7.8-1.7 1.2-2.8 1.3 0 .1 0 .1-.1.1z"/>
            <path d="M23 24c-.3 0-.5-.1-.7-.3l-22-22C-.1 1.3-.1.7.3.3s1-.4 1.4 0l22 22c.4.4.4 1 0 1.4-.2.2-.4.3-.7.3z"/>
        </svg>
    );
}

export const menu = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21 13H3c-.6 0-1-.4-1-1s.4-1 1-1h18c.6 0 1 .4 1 1s-.4 1-1 1zM21 7H3c-.6 0-1-.4-1-1s.4-1 1-1h18c.6 0 1 .4 1 1s-.4 1-1 1zM21 19H3c-.6 0-1-.4-1-1s.4-1 1-1h18c.6 0 1 .4 1 1s-.4 1-1 1z"/>
        </svg>
    );
}

export const layout = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19 22H5c-1.7 0-3-1.3-3-3V5c0-1.7 1.3-3 3-3h14c1.7 0 3 1.3 3 3v14c0 1.7-1.3 3-3 3zM5 4c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1h14c.6 0 1-.4 1-1V5c0-.6-.4-1-1-1H5z"/>
            <path d="M21 10H3c-.6 0-1-.4-1-1s.4-1 1-1h18c.6 0 1 .4 1 1s-.4 1-1 1z"/>
            <path d="M9 22c-.6 0-1-.4-1-1V9c0-.6.4-1 1-1s1 .4 1 1v12c0 .6-.4 1-1 1z"/>
        </svg>
    );
}

export const open_book = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 22c-.6 0-1-.4-1-1 0-1.1-.9-2-2-2H2c-.6 0-1-.4-1-1V3c0-.6.4-1 1-1h6c2.8 0 5 2.2 5 5v14c0 .6-.4 1-1 1zm-9-5h6c.7 0 1.4.2 2 .5V7c0-1.7-1.3-3-3-3H3v13z"/>
            <path d="M12 22c-.6 0-1-.4-1-1V7c0-2.8 2.2-5 5-5h6c.6 0 1 .4 1 1v15c0 .6-.4 1-1 1h-7c-1.1 0-2 .9-2 2 0 .6-.4 1-1 1zm4-18c-1.7 0-3 1.3-3 3v10.5c.6-.3 1.3-.5 2-.5h6V4h-5z"/>
        </svg>
    );
}

export const bell = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21 18H3c-.4 0-.8-.3-1-.7-.1-.4 0-.9.4-1.1 0 0 2.6-1.9 2.6-8.2 0-3.9 3.1-7 7-7s7 3.1 7 7c0 6.3 2.5 8.2 2.6 8.2.4.3.5.7.4 1.1s-.6.7-1 .7zM5.1 16h13.7C18 14.5 17 12 17 8c0-2.8-2.2-5-5-5S7 5.2 7 8c0 4-1 6.5-1.9 8zM12 23c-.5 0-1-.1-1.5-.4-.5-.3-.8-.6-1.1-1.1-.3-.5-.1-1.1.4-1.4.5-.3 1.1-.1 1.4.4.1.1.2.3.4.4.5.3 1.1.1 1.4-.4.3-.5.9-.6 1.4-.4.5.3.6.9.4 1.4C14 22.5 13 23 12 23z"/>
        </svg>
    );
}

export const log_out = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M9 22H5c-1.7 0-3-1.3-3-3V5c0-1.7 1.3-3 3-3h4c.6 0 1 .4 1 1s-.4 1-1 1H5c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1h4c.6 0 1 .4 1 1s-.4 1-1 1zM16 18c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l4.3-4.3-4.3-4.3c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l5 5c.4.4.4 1 0 1.4l-5 5c-.2.2-.4.3-.7.3z"/>
            <path d="M21 13H9c-.6 0-1-.4-1-1s.4-1 1-1h12c.6 0 1 .4 1 1s-.4 1-1 1z"/>
        </svg>
    );
}

export const home = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19 23H5c-1.7 0-3-1.3-3-3V9c0-.3.1-.6.4-.8l9-7c.4-.3.9-.3 1.2 0l9 7c.3.2.4.5.4.8v11c0 1.7-1.3 3-3 3zM4 9.5V20c0 .6.4 1 1 1h14c.6 0 1-.4 1-1V9.5l-8-6.2-8 6.2z"/>
            <path d="M15 23c-.6 0-1-.4-1-1v-9h-4v9c0 .6-.4 1-1 1s-1-.4-1-1V12c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v10c0 .6-.4 1-1 1z"/>
        </svg>
    );
}

export const user = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M20 22c-.6 0-1-.4-1-1v-2c0-1.7-1.3-3-3-3H8c-1.7 0-3 1.3-3 3v2c0 .6-.4 1-1 1s-1-.4-1-1v-2c0-2.8 2.2-5 5-5h8c2.8 0 5 2.2 5 5v2c0 .6-.4 1-1 1zM12 12c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"/>
        </svg>
    );
}

export const users = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M17 22c-.6 0-1-.4-1-1v-2c0-1.7-1.3-3-3-3H5c-1.7 0-3 1.3-3 3v2c0 .6-.4 1-1 1s-1-.4-1-1v-2c0-2.8 2.2-5 5-5h8c2.8 0 5 2.2 5 5v2c0 .6-.4 1-1 1zM9 12c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8C7.3 4 6 5.3 6 7s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zM23 22c-.6 0-1-.4-1-1v-2c0-1.4-.9-2.6-2.3-2.9-.5-.1-.9-.7-.7-1.2.1-.5.7-.9 1.2-.7 2.2.6 3.7 2.6 3.8 4.8v2c0 .6-.4 1-1 1zM16 11.9c-.4 0-.9-.3-1-.8-.1-.5.2-1.1.7-1.2 1.1-.3 1.9-1.1 2.2-2.2.4-1.6-.6-3.2-2.2-3.7-.5 0-.8-.6-.7-1.1.1-.5.7-.9 1.2-.7 2.7.7 4.3 3.4 3.6 6.1-.5 1.8-1.8 3.2-3.6 3.6H16z"/>
        </svg>
    );
}

export const key = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M7.5 22c-1.6 0-3.3-.6-4.6-1.9-2.6-2.6-2.5-6.8.1-9.3 2.3-2.2 5.8-2.4 8.3-.6l9-9c.4-.4 1-.4 1.4 0s.4 1 0 1.4L20.4 4l2.3 2.3c.4.4.4 1 0 1.4l-3.5 3.5c-.4.4-1 .4-1.4 0l-2.3-2.3-2.7 2.7c1.9 2.5 1.7 6.1-.6 8.4-1.3 1.4-3 2-4.7 2zm.1-10.9c-1.1 0-2.3.4-3.1 1.3-1.8 1.7-1.8 4.6-.1 6.4 1.8 1.8 4.7 1.8 6.4 0 1.7-1.8 1.7-4.6 0-6.4-1-.9-2.1-1.3-3.2-1.3zm9.3-3.6l1.6 1.6L20.6 7 19 5.4l-2.1 2.1z"/>
        </svg>
    );
}

export const search = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M11 20c-5 0-9-4-9-9s4-9 9-9 9 4 9 9-4 9-9 9zm0-16c-3.9 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7z"/>
            <path d="M21 22c-.3 0-.5-.1-.7-.3L16 17.4c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l4.3 4.3c.4.4.4 1 0 1.4-.2.2-.4.3-.7.3z"/>
        </svg>
    );
}

export const edit = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M2 23c-.3 0-.5-.1-.7-.3-.3-.3-.4-.6-.3-1l1.5-5.5c0-.2.1-.3.3-.4L16.3 2.3c1.5-1.5 3.9-1.5 5.4 0 1.5 1.5 1.5 3.9 0 5.4L8.2 21.2c-.1.1-.3.2-.4.3L2.3 23H2zm2.4-6l-1 3.6 3.6-1L20.3 6.3c.7-.7.7-1.9 0-2.6s-1.9-.7-2.6 0L4.4 17zm3.1 3.5z"/>
        </svg>
    );
}

export const plus = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 20c-.6 0-1-.4-1-1V5c0-.6.4-1 1-1s1 .4 1 1v14c0 .6-.4 1-1 1z"/>
            <path d="M19 13H5c-.6 0-1-.4-1-1s.4-1 1-1h14c.6 0 1 .4 1 1s-.4 1-1 1z"/>
        </svg>
    );
}

export const trash = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21 7H3c-.6 0-1-.4-1-1s.4-1 1-1h18c.6 0 1 .4 1 1s-.4 1-1 1z"/>
            <path d="M17 23H7c-1.7 0-3-1.3-3-3V6c0-.6.4-1 1-1s1 .4 1 1v14c0 .6.4 1 1 1h10c.6 0 1-.4 1-1V6c0-.6.4-1 1-1s1 .4 1 1v14c0 1.7-1.3 3-3 3zM16 7c-.6 0-1-.4-1-1V4c0-.6-.4-1-1-1h-4c-.6 0-1 .4-1 1v2c0 .6-.4 1-1 1s-1-.4-1-1V4c0-1.7 1.3-3 3-3h4c1.7 0 3 1.3 3 3v2c0 .6-.4 1-1 1z"/>
        </svg>
    );
}

export const check_circle = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 23C5.9 23 1 18.1 1 12S5.9 1 12 1c1.6 0 3.1.3 4.5 1 .5.2.7.8.5 1.3-.2.5-.8.7-1.3.5-1.2-.5-2.4-.8-3.7-.8-5 0-9 4-9 9s4 9 9 9 9-4 9-9v-.9c0-.6.4-1 1-1s1 .4 1 1v.9c0 6.1-4.9 11-11 11z"/>
            <path d="M12 15c-.3 0-.5-.1-.7-.3l-3-3c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l2.3 2.3 9.3-9.3c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-10 10c-.2.2-.4.3-.7.3z"/>
        </svg>
    );
}

export const briefcase = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M20 22H4c-1.7 0-3-1.3-3-3V9c0-1.7 1.3-3 3-3h16c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3zM4 8c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h16c.6 0 1-.4 1-1V9c0-.6-.4-1-1-1H4z"/>
            <path d="M16 22c-.6 0-1-.4-1-1V5c0-.6-.4-1-1-1h-4c-.6 0-1 .4-1 1v16c0 .6-.4 1-1 1s-1-.4-1-1V5c0-1.7 1.3-3 3-3h4c1.7 0 3 1.3 3 3v16c0 .6-.4 1-1 1z"/>
        </svg>
    );
}

export const slash = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 23C5.9 23 1 18.1 1 12S5.9 1 12 1s11 4.9 11 11-4.9 11-11 11zm0-20c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z"/>
            <path d="M19.1 20.1c-.3 0-.5-.1-.7-.3L4.2 5.6c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l14.1 14.1c.4.4.4 1 0 1.4-.1.3-.4.4-.6.4z"/>
        </svg>
    );
}

export const arrow_left = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19 13H5c-.6 0-1-.4-1-1s.4-1 1-1h14c.6 0 1 .4 1 1s-.4 1-1 1z"/>
            <path d="M12 20c-.3 0-.5-.1-.7-.3l-7-7c-.4-.4-.4-1 0-1.4l7-7c.4-.4 1-.4 1.4 0s.4 1 0 1.4L6.4 12l6.3 6.3c.4.4.4 1 0 1.4-.2.2-.4.3-.7.3z"/>
        </svg>
    );
}

export const video = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M23 18c-.2 0-.4-.1-.6-.2l-7-5c-.2-.2-.4-.5-.4-.8s.2-.6.4-.8l7-5c.3-.2.7-.2 1-.1.4.2.6.5.6.9v10c0 .4-.2.7-.5.9-.2.1-.3.1-.5.1zm-5.3-6l4.3 3.1V8.9L17.7 12z"/>
            <path d="M14 20H3c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h11c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3zM3 6c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h11c.6 0 1-.4 1-1V7c0-.6-.4-1-1-1H3z"/>
        </svg>
    );
}

export const message = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M3 22c-.1 0-.3 0-.4-.1-.4-.1-.6-.5-.6-.9V5c0-1.7 1.3-3 3-3h14c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7.4l-3.7 3.7c-.2.2-.4.3-.7.3zM5 4c-.6 0-1 .4-1 1v13.6l2.3-2.3c.2-.2.4-.3.7-.3h12c.6 0 1-.4 1-1V5c0-.6-.4-1-1-1H5z"/>
        </svg>
    );
}

export const external_link = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M16 22H5c-1.7 0-3-1.3-3-3V8c0-1.7 1.3-3 3-3h6c.6 0 1 .4 1 1s-.4 1-1 1H5c-.6 0-1 .4-1 1v11c0 .6.4 1 1 1h11c.6 0 1-.4 1-1v-6c0-.6.4-1 1-1s1 .4 1 1v6c0 1.7-1.3 3-3 3zM21 10c-.6 0-1-.4-1-1V4h-5c-.6 0-1-.4-1-1s.4-1 1-1h6c.6 0 1 .4 1 1v6c0 .6-.4 1-1 1z"/>
            <path d="M10 15c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l11-11c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-11 11c-.2.2-.4.3-.7.3z"/>
        </svg>
    );
}

export const chevron = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M15 19c-.3 0-.5-.1-.7-.3l-6-6c-.4-.4-.4-1 0-1.4l6-6c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.4 12l5.3 5.3c.4.4.4 1 0 1.4-.2.2-.4.3-.7.3z"/>
        </svg>
    );
}

export const chevrons = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M11 18c-.3 0-.5-.1-.7-.3l-5-5c-.4-.4-.4-1 0-1.4l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L7.4 12l4.3 4.3c.4.4.4 1 0 1.4-.2.2-.4.3-.7.3z"/>
            <path d="M18 18c-.3 0-.5-.1-.7-.3l-5-5c-.4-.4-.4-1 0-1.4l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L14.4 12l4.3 4.3c.4.4.4 1 0 1.4-.2.2-.4.3-.7.3z"/>
        </svg>
    );
}

export const globe = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 23C5.9 23 1 18.1 1 12S5.9 1 12 1s11 4.9 11 11-4.9 11-11 11zm0-20c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z"/>
            <path d="M22 13H2c-.6 0-1-.4-1-1s.4-1 1-1h20c.6 0 1 .4 1 1s-.4 1-1 1z"/>
            <path d="M12 23c-.3 0-.5-.1-.7-.3C8.6 19.8 7.1 16 7 12c.1-4 1.6-7.8 4.3-10.7.2-.2.4-.3.7-.3.3 0 .5.1.7.3C15.4 4.2 16.9 8 17 12c-.1 4-1.6 7.8-4.3 10.7-.2.2-.4.3-.7.3zm0-19.4C10.1 6 9.1 8.9 9 12c.1 3 1.1 6 3 8.4 1.9-2.4 2.9-5.4 3-8.5-.1-3-1.1-5.9-3-8.3z"/>
        </svg>
    );
}

export const headphones = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21 19c-.6 0-1-.4-1-1v-6c0-4.4-3.6-8-8-8s-8 3.6-8 8v6c0 .6-.4 1-1 1s-1-.4-1-1v-6C2 6.5 6.5 2 12 2s10 4.5 10 10v6c0 .6-.4 1-1 1z"/>
            <path d="M19 22h-1c-1.7 0-3-1.3-3-3v-3c0-1.7 1.3-3 3-3h3c.6 0 1 .4 1 1v5c0 1.7-1.3 3-3 3zm-1-7c-.6 0-1 .4-1 1v3c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-4h-2zM6 22H5c-1.7 0-3-1.3-3-3v-5c0-.6.4-1 1-1h3c1.7 0 3 1.3 3 3v3c0 1.7-1.3 3-3 3zm-2-7v4c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-3c0-.6-.4-1-1-1H4z"/>
        </svg>
    );
}

export const mail = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M20 21H4c-1.7 0-3-1.3-3-3V6c0-1.7 1.3-3 3-3h16c1.7 0 3 1.3 3 3v12c0 1.7-1.3 3-3 3zM4 5c-.6 0-1 .4-1 1v12c0 .6.4 1 1 1h16c.6 0 1-.4 1-1V6c0-.6-.4-1-1-1H4z"/>
            <path d="M12 14c-.2 0-.4-.1-.6-.2l-10-7c-.4-.3-.5-.9-.2-1.4.3-.4.9-.5 1.4-.2l9.4 6.6 9.4-6.6c.5-.3 1.1-.2 1.4.2.3.5.2 1.1-.2 1.4l-10 7c-.2.1-.4.2-.6.2z"/>
        </svg>
    );
}

export const onGoing = (styles) => {
    return (
        <svg
            className={`${styles} tw-fill-current`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <circle cx="30" cy="50" fill="#f1f1f1" r="20">
                <animate attributeName="cx" repeatCount="indefinite" dur="1s" keyTimes="0;0.5;1" values="30;70;30" begin="-0.5s"/>
            </circle><circle cx="70" cy="50" fill="#fff" r="20">
            <animate attributeName="cx" repeatCount="indefinite" dur="1s" keyTimes="0;0.5;1" values="30;70;30" begin="0s"/>
        </circle>
            <circle cx="30" cy="50" fill="#f1f1f1" r="20">
                <animate attributeName="cx" repeatCount="indefinite" dur="1s" keyTimes="0;0.5;1" values="30;70;30" begin="-0.5s"/>
                <animate attributeName="fill-opacity" values="0;0;1;1" calcMode="discrete" keyTimes="0;0.499;0.5;1" dur="1s" repeatCount="indefinite"/>
            </circle>
        </svg>
    );
}

export const arrowUp = (styles) => {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
            className={`${styles} tw-fill-current`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-up">
            <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
    )
}

export const airplay = (styles) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" fill="none" stroke="currentColor" 
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="feather feather-airplay"
            className={`${styles}`}
            >
            <path d="M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1"/>
            <path d="M12 15l5 6H7l5-6z"/>
        </svg>
    )
}

export const calendar = (styles) => {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" fill="none" stroke="currentColor" 
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            class="feather feather-calendar"
            className={`${styles}`}
            >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
    )
}

export const layers = (styles) =>{
    return(
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" fill="none" stroke="currentColor" 
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            class="feather feather-layers"
            className={`${styles}`}
            >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
    )
}

export const plus_square = (styles) => {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" fill="none" stroke="currentColor" 
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            class="feather feather-plus-square"
            className={`${styles}`}
            >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <path d="M12 8v8M8 12h8"/>
        </svg>
    )
}

export const grid = (styles) =>{
    return(
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" fill="none" stroke="currentColor" 
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            class="feather feather-grid"
            className={`${styles}`}
            >
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>
        </svg>
    )
}