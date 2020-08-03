import React from "react";
import getColor from "../../../assets/colors";

const News = ({ text, tags, time }) => {

    return (
        <div className="w-full py-2 mt-6 border-b border-grayish">
            <p className="text-white mb-4">{text}</p>
            <div className="w-full flex flex-row justify-between items-center">
                <span className="text-grayish text-sm">{time}</span>
                <div className="w-3/4 flex flex-wrap flex-row-reverse justify-start items-center">
                    {tags.map((tag, i) => {
                        return (
                            <div className={`px-6 py-1 ml-2 mb-2 rounded-full text-white bg-${getColor(i)}`}>
                                {tag}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

}

export default News;