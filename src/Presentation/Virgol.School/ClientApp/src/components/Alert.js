import React from "react";
import { motion } from 'framer-motion';
import {alert_octagon, x} from "../assets/icons";

const Alert = ({ type, message, fade }) => {

    return (
        <motion.div className="fixed z-50 top-0 w-screen mt-8"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
        >
            <div className={`rounded-full mx-auto w-11/12 max-w-500 px-4 py-2 flex flex-row justify-between items-center ${type === 'alert-success' ? 'bg-greenish' : 'bg-redish'}`}>
                {type === 'alert-error' ?
                    alert_octagon('w-6 text-white')
                    :
                    ''
                }
                <p className="text-white px-2 text-center">{message}</p>
                <div onClick={fade} className="cursor-pointer">
                    {x('w-6 text-white')}
                </div>
            </div>
        </motion.div>
    );

}

export default Alert;