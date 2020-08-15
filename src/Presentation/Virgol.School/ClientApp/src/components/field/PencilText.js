import React from 'react';
import { edit } from '../../assets/icons';

const PencilText = ({ text , className, show, showBox, value, changeValue, submit , schoolData , schoolCode , ChangeCode }) => {

    return (
        <div onClick={e => e.stopPropagation()} className="relative flex flex-row-reverse items-center">
            <p className={className}>{text}</p>

            {(schoolData ?
                <p className={"mx-3 " + className}>#{schoolCode}</p>
            : null)}

            <div onClick={showBox} className="mx-2">
                {edit('w-6 z-20 text-white cursor-pointer')}
            </div>
            <div className={`absolute text-center z-30 w-48 py-4 px-2 bg-black-blue bottomize ${show ? 'block' : 'hidden'}`}>
                <input 
                    value={value}
                    onChange={(e) => changeValue(e.target.value)}
                    type="text"
                    dir="rtl"
                    placeholder="نام جدید"
                    className={`w-11/12 px-4 py-2 text-white bg-transparent focus:outline-none focus:shadow-outline border-2 border-dark-blue rounded-lg`}
                />

                {(schoolData ? 
                 <input 
                    value={value}
                    onChange={(e) => ChangeCode(e.target.value)}
                    type="text"
                    dir="rtl"
                    placeholder="کد جدید"
                    className={`w-11/12 px-4 py-2 text-white bg-transparent focus:outline-none focus:shadow-outline border-2 border-dark-blue rounded-lg`}
                />
                :
                null)}

                <button onClick={submit} className={`w-11/12 mt-4 py-2 text-white bg-greenish focus:outline-none focus:shadow-outline rounded-lg`}>
                    ذخیره
                </button>
            </div>
        </div>
    );

}

export default PencilText;