import React from "react";
import { motion } from "framer-motion";
import {logo, menu, x} from "../../../assets/icons";

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
        <motion.div className="lg:w-1/6 z-40 w-3/4 lg:max-w-full max-w-250 h-screen fixed top-0 right-0 bg-black-blue"
            animate={show ? 'open' : 'close'}
            transition="transition"
            variants={sidebarVar}
        >
            <motion.div onClick={toggle} className="lg:hidden block absolute sidebar-toggle cursor-pointer"
                // whileTap={{ rotate: 90 }}
                animate={show ? 'open' : 'close'}
                transition="transition"
                variants={toggleVar}
            >
                {show ? x('w-8 text-white') : menu("w-8 text-white")}
            </motion.div>
            
            {
                process.env.REACT_APP_RAHE_DOOR !== "true" ?
                    logo('w-16 my-3 text-purplish mx-auto')
                    :
                logoTitle === 0 ?
                <img src={`${process.env.PUBLIC_URL}/icons/sampad.png`} />
                : 
                logoTitle === 1 ?
                <img src={`${process.env.PUBLIC_URL}/icons/RD.png`} /> 
                : 
                <h1 className="text-center lg:mt-4 mt-10 text-xl text-white font-vm">
                    <img className="w-24 mx-auto mb-3" src={`${process.env.PUBLIC_URL}/icons/RD.png`} alt="logo" />
                </h1>
            }



            <div className="w-full mt-10">
                {children}
            </div>
        </motion.div>
    );

}

export default Sidebar;