import React from 'react';
import {arrow} from "../../../../assets/icons";

const CourseCard = (props) => {

    const mainColor = () => {
        switch (props.code % 4) {
            case 0: return "bg-green"
            case 1: return "bg-purple"
            case 2: return "bg-sky"
            case 3: return "bg-magneta"
        }
    }

    const renderThumbnail = () => {
        switch (props.code % 4) {
            case 0: return <div className="w-16 h-16 flex justify-center items-center py-2 font-vb text-2xl rounded-xl text-white bg-green-light">{props.name[0]}</div>
            case 1: return <div className="w-16 h-16 flex justify-center items-center py-2 font-vb text-2xl rounded-xl text-white bg-light-purple">{props.name[0]}</div>
            case 2: return <div className="w-16 h-16 flex justify-center items-center py-2 font-vb text-2xl rounded-xl text-white bg-light-sky">{props.name[0]}</div>
            case 3: return <div className="w-16 h-16 flex justify-center items-center py-2 font-vb text-2xl rounded-xl text-white bg-light-magneta">{props.name[0]}</div>
        }
    }

    return (
        <div className={`flex flex-row justify-start items-center cursor-pointer px-4 ml-4 min-w-300 my-4 h-24 bg-red-500 rounded-xl ${mainColor()}`}>
            <a className="absolute top-0 bottom-0 right-0 left-0" href={props.url} target="_blank">
            </a>
            {renderThumbnail()}
            <div className="text-right mx-4 flex-grow">
                <span className="block font-vb text-white text-xl">{props.name}</span>
                <span className="block text-sm text-white">{props.teacher}</span>
            </div>
            <div className="">
                {arrow("w-8 text-white transform rotate-180")}
            </div>
        </div>
    );

}

export default CourseCard;