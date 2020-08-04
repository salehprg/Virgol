import React from "react";
import { motion } from "framer-motion";
import {menu, x} from "../../../assets/icons";

const   Sidebar = ({ show, toggle, active, changeActive, children }) => {

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

    return (
        <motion.div className="lg:w-1/6 z-40 w-3/4 lg:max-w-full max-w-250 h-screen fixed top-0 right-0 bg-black-blue"
            animate={show ? 'open' : 'close'}
            transition="transition"
            variants={sidebarVar}
        >
            <motion.div onClick={toggle} className="lg:hidden block absolute sidebar-toggle cursor-pointer"
                whileTap={{ rotate: 90 }}
            >
                {show ? x('w-8 text-white') : menu("w-8 text-white")}
            </motion.div>

            <h1 className="text-center mt-4 text-2xl text-white font-vm">ویرگول</h1>

            <div className="w-full mt-10">
                {children}
            </div>
        </motion.div>
    );

}

export default Sidebar;