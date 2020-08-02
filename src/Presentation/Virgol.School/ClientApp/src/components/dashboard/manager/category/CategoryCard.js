import React from 'react';
import {Link} from "react-router-dom";

const CategoryCard = (props) => {

    const mainColor = () => {
        switch (props.code % 4) {
            case 0: return "green"
            case 1: return "purple"
            case 2: return "sky"
            case 3: return "magneta"
        }
    }

    const lightColor = () => {
        switch (props.code % 4) {
            case 0: return "green-light2"
            case 1: return "light-purple"
            case 2: return "light-sky"
            case 3: return "light-magneta"
        }
    }

    return (
        <div className={`min-w-200 category relative h-48 bg-${mainColor()} rounded-xl flex flex-col justify-evenly items-center`}>
            <span className="text-xl text-white">{props.title}</span>
            <Link className={`w-2/3 text-center py-1 text-${mainColor()} rounded-full font-vb bg-white`} to={props.link}>بیشتر</Link>

            <div className={`w-full h-24 px-4 overflow-hidden category-reveal bg-${lightColor()} rounded-xl absolute bottom-0 flex flex-col justify-evenly items-center`}>
                <div className="w-full my-1 flex flex-row justify-start items-center">
                    <div className={`w-10 h-10 bg-${mainColor()} flex justify-center items-center rounded-full`}>
                        <span className="text-lg text-white">0</span>
                    </div>
                    <span className="text-white mx-4">کلاس ها</span>
                </div>

                <div className="w-full my-1 flex flex-row justify-start items-center">
                    <div className={`w-10 h-10 bg-${mainColor()} flex justify-center items-center rounded-full`}>
                        <span className="text-lg text-white">0</span>
                    </div>
                    <span className="text-white mx-4">دانش آموزان</span>
                </div>
            </div>
        </div>
    );

}

export default CategoryCard;