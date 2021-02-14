import React from "react";
import getColor from "../../../assets/colors";

const News = ({ text, tags, time }) => {

    return (
        <div className="tw-w-full tw-py-2 tw-mt-6 tw-border-b tw-border-grayish">
            <p className="tw-text-white tw-mb-4" style={{direction : "rtl"}}>{text}</p>
            <div className="tw-w-full tw-flex tw-flex-row tw-justify-between tw-items-center">
                <span className="tw-text-grayish tw-text-sm">{time}</span>
                <div className="tw-w-3/4 tw-flex tw-flex-wrap tw-flex-row-reverse tw-justify-start tw-items-center">
                    {(tags 
                    ? 
                    tags.map((tag, i) => {
                        return (
                            <div className={`tw-px-6 tw-py-1 tw-ml-2 tw-mb-2 tw-rounded-full tw-text-white tw-bg-${getColor(i)}`}>
                                {tag}
                            </div>
                        );
                    })
                    : 
                    null)}
                </div>
            </div>
        </div>
    );

}

export default News;