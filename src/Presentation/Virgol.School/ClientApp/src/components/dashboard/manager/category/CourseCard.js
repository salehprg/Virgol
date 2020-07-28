import React, {useState} from 'react';
import {remove} from "../../../../assets/icons";

const CourseCard = (props) => {

    const mainColor = () => {
        switch (props.code % 4) {
            case 0: return "green"
            case 1: return "purple"
            case 2: return "sky"
            case 3: return "magneta"
        }
    }

    return (
        <div className={`flex flex-row justify-start items-center px-4 w-5/6 my-4 h-16 rounded-xl bg-${mainColor()}`}>
            <div onClick={(e) => e.stopPropagation()} className="cursor-pointer relative">
                <div onClick={() => props.showConfirm(props.course.id)}>
                    {remove("w-6 text-white")}
                </div>
                <div className={`${props.confirm === props.course.id ? 'block' : 'hidden'} absolute bg-white rounded-xl w-48 py-2 shadow-2xl text-center`}>
                    <span className="block py-2">آیا مطمئنید؟</span>
                    <button onClick={() => props.delete(props.course.id)} className="px-6 py-1 text-sm rounded-xl bg-red-600 text-white focus:outline-none">حذف</button>
                </div>
            </div>
            <div className="text-right mx-4 flex-grow">
                <span className="block font-vb text-white text-xl">{props.course.shortname}</span>
                <span className="block text-sm text-white">{props.course.teacherName}</span>
            </div>
        </div>
    );

}

export default CourseCard;