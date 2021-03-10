import React from "react";
import { motion } from "framer-motion";
import {logo, menu, x} from "../../../assets/icons";
import { localizer } from '../../../assets/localizer';

const Sidebar = ({ show, toggle,title , logoTitle, active, changeActive, children }) => {

    const sidebarVar = {
        open: {
            x: '0'
        },
        close: {
            x: '100%'
        },
        transition: {
            duration: 0.5
        }
    }

    const toggleVar = {
        open: {
            x: 50
        },
        close: {
            x: 0
        },
        transition: {
            duration: 0.5
        }
    }

    return (
        
        <motion.div className="lg:tw-w-1/6 tw-z-40  lg:tw-max-w-full tw-max-w-250 tw-h-screen tw-fixed tw-top-0 tw-right-0 tw-bg-black-blue"
            animate={show ? 'open' : 'close'}
            transition="transition"
            variants={sidebarVar}
        >
            <motion.div onClick={toggle} className="lg:tw-hidden tw-block tw-absolute sidebar-toggle tw-cursor-pointer"
                // whileTap={{ rotate: 90 }}
                animate={show ? 'open' : 'close'}
                transition="transition"
                variants={toggleVar}
            >
                {show ? x('tw-w-8 tw-text-white') : menu("tw-w-8 tw-text-white")}
            </motion.div>
            
            {/* {
                process.env.REACT_APP_RAHE_DOOR !== "true" ?
                <img className="w-24 mx-auto mb-3" src={`${process.env.PUBLIC_URL}/icons/Logo.png`} />
                    :
                logoTitle === 0 ?
                <img className="w-24 mx-auto mb-3" src={`${process.env.PUBLIC_URL}/icons/sampad.png`} />
                : 
                logoTitle === 1 ?
                <img className="w-24 mx-auto mb-3" src={`${process.env.PUBLIC_URL}/icons/RD.png`} /> 
                : 
                <h1 className="text-center lg:mt-4 mt-10 text-xl text-white font-vm">
                    <img className="w-24 mx-auto mb-3" src={`${process.env.PUBLIC_URL}/icons/RD.png`} alt="logo" />
                </h1>
            } */}

            <img className="tw-w-24 tw-mx-auto tw-my-3" src={localizer.getLogo(window.location.href)} />
            <div className="tw-w-full tw-mt-10 tw-max-h-75 tw-overflow-y-auto">
                {children}
            </div>
            
        </motion.div>
        
    );

}

export default Sidebar;