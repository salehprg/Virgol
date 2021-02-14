import React, { useEffect } from "react";
import { motion } from 'framer-motion';
import {alert_octagon, check_circle, x} from "../assets/icons";

const Alert = ({ type, message, fade }) => {

    useEffect(() => {
        setTimeout(function(){ fade() }, 10000);
    }, [])

    return (
        <motion.div className="tw-fixed tw-z-50 tw-top-0 tw-w-screen tw-mt-8"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
        >
            <div className={`tw-rounded-full tw-mx-auto tw-w-11/12 tw-max-w-500 tw-px-4 tw-py-2 tw-flex tw-flex-row tw-justify-between tw-items-center ${type === 'alert-success' ? 'tw-bg-greenish' : 'tw-bg-redish'}`}>
                {type === 'alert-error' ?
                    alert_octagon('tw-w-6 tw-text-white')
                    :
                    check_circle('tw-w-6 tw-text-white')
                }
                <p className="tw-text-white tw-px-2 tw-text-center">{message}</p>
                <div onClick={fade} className="tw-cursor-pointer">
                    {x('tw-w-6 tw-text-white')}
                </div>
            </div>
        </motion.div>
    );

}

export default Alert;