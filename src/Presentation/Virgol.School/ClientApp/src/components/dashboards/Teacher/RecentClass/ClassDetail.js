import React from "react";
import { withTranslation } from 'react-i18next';
import getColor from "../../../../assets/colors";

const RecentClassDetail = ({ text,day, startTime , endTime , schoolName , className , onStart , onEnd , joinable }) => {

    return (
        <div className="w-full py-2 mt-6 border-b border-grayish">
            <div className="w-full flex flex-row justify-between items-center">
                <span className="w-1/3 text-white mb-4">{day} {this.props.t('from')} {startTime} {this.props.t('till')} {endTime}</span>
                <span className="w-3/4 text-white mb-4">{text}</span>
            </div>
            <div className="w-full flex flex-row justify-between items-center">
                <span className="text-grayish text-sm">{schoolName} ({className})</span>
                
                <div className="w-2/4 flex flex-wrap flex-row-reverse justify-start items-center">
                    <button onClick={() => onStart()} className={`px-6 py-1 ml-2 mb-2 rounded-full text-white bg-${getColor((joinable ? 3 : 2))}`}>
                        {(joinable ? this.props.t('enterClass') : this.props.t('createClass'))}
                    </button>
                    {(joinable ? 
                        <button onClick={() => onEnd()} className={`px-6 py-1 ml-2 mb-2 rounded-full text-white bg-${getColor(1)}`}>
                            {this.props.t('endClass')}
                        </button> : null )}
                </div>
            </div>
        </div>
    );

}

export default withTranslation()(RecentClassDetail);