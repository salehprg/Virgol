import React from 'react';

const ManagerGenerated = ({ title, value }) => {

    return(
        <div className="w-full my-6">
            <p className="text-white text-right mb-1"> {title} </p>
            <div className="rounded-lg px-4 py-2 border-2 border-pinkish flex flex-row justify-between items-center">
                <span className="text-white"> {value} </span>
            </div>
        </div>
    );

}

export default ManagerGenerated;