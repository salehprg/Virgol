import React from "react";

class Card extends React.Component {

    render() {
        return (
            <div className="flex flex-col w-full h-full text-right">
                <span className="text-pri text-2xl mb-2">{this.props.title}</span>
                <div className="w-full text-center h-500 bg-white rtl rounded-lg pt-4 overflow-auto">
                    {this.props.children}
                </div>
            </div>
        );
    }

}

export default Card;