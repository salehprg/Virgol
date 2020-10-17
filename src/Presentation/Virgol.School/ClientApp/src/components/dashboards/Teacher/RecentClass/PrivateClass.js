import React from "react";
import { withTranslation } from 'react-i18next';
import getColor from "../../../../assets/colors";

const PrivateClass = ({ text, onEnd , onStart }) => {
    
    return (
        <div className="w-full py-2 mt-6 border-b border-grayish">
            <div className="w-full flex flex-row justify-between items-center">
                <span className="w-full text-white mb-4">{text}</span>
            </div>
            <div className="w-full flex flex-row justify-between items-center">
                <div className="flex flex-wrap flex-row-reverse justify-start items-center">
                    <button onClick={() => onStart()} className={`px-6 py-1 ml-2 mb-2 rounded-full text-white bg-${getColor(3)}`}>
                        {this.props.t('copyLink')}
                    </button> 
                    <button onClick={() => onEnd()} className={`px-6 py-1 ml-2 mb-2 rounded-full text-white bg-${getColor(1)}`}>
                        {this.props.t('closeLink')}
                    </button>
                </div>
            </div>
        </div>
    );

}

export default withTranslation()(PrivateClass);