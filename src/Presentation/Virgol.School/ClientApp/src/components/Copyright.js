import React, {useEffect, useState} from "react";
import {motion} from 'framer-motion';
import {logo} from "../assets/icons";

const Copyright = () => {

    const vars = {
        open: {
            opacity: 1
        },
        close: {
            opacity: 0
        },
        transition: {
            duration: 0.5
        }
    }

    const [show, setShow] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShow(true);
            setTimeout(() => {
                setShow(false);
            }, 3000)
        }, 1000)
    }, [])

    return (
        <motion.div className="fixed w-screen bg-transparent opacity-0"
            animate={show ? 'open' : 'close'}
            transition="transition"
            variants={vars}
        >
            <div className="w-5/6 bg-white flex flex-row-reverse justify-evenly items-center rounded-lg px-4 py-1 text-center max-w-350 md:ml-12 mt-12 mx-auto">
                {logo("w-12 text-purplish")}
                <p>
                    طراحی و توسعه توسط تیم ویرگول دانشگاه فردوسی مشهد
                </p>
            </div>
        </motion.div>
    );

}

export default Copyright;