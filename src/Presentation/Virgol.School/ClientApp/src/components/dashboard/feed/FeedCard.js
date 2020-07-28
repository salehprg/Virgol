import React from 'react';

const FeedCard = (props) => {

    const renderTags = () => {
        return props.tags.map(tag => {
            return (
                <span key={tag.text} className={`px-4 py-1 m-1 text-sm rounded-full ${tag.color} text-white`}>{tag.text}</span>
            );
        })
    }

    return (
        <div className="w-full text-right border-b border-grayish mt-8">
            <p className="xl:text-lg text-sm w-full mb-4">{props.message}</p>
            <div className="w-full flex xl:flex-row-reverse flex-col justify-between">
                <div className="xl:w-1/2 w-full flex flex-row-reverse flex-wrap justify-start items-center">
                    {renderTags()}
                </div>
                <div className="flex flex-row-reverse items-center">
                    <span className="text-grayish mx-2 text-sm">{props.author}</span>
                    <span className="text-grayish mx-2 text-sm">{props.time}</span>
                    <span className="text-grayish mx-2 text-sm">{props.date}</span>
                </div>
            </div>
        </div>
    );

}

export default FeedCard;