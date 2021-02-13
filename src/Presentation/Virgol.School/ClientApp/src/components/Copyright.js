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
        <motion.div className="tw-fixed tw-w-screen tw-bg-transparent tw-opacity-0"
            animate={show ? 'open' : 'close'}
            transition="transition"
            variants={vars}
        >
            <div className="tw-w-5/6 tw-bg-white tw-flex tw-flex-row-reverse tw-justify-evenly tw-items-center tw-rounded-lg tw-px-4 tw-py-1 tw-text-center tw-max-w-350 md:tw-ml-12 tw-mt-12 tw-mx-auto">
                {logo("tw-w-12 tw-text-purplish")}
                <p>
                    طراحی و توسعه توسط تیم ویرگول دانشگاه فردوسی مشهد
                </p>
            </div>
        </motion.div>
    );

}

export default Copyright;