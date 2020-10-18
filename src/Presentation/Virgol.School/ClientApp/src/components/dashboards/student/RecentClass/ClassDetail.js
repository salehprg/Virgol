import React from "react";
import { withTranslation } from 'react-i18next';
import getColor from "../../../../assets/colors";

class RecentClassDetail extends React.Component {

    render (){
        const { text,day , startTime , endTime , schoolName , className , onStart , onEnd , joinable } = this.props

        return (
            <div className="w-full py-2 mt-6 border-b border-grayish">
                {console.log("Props : " + this.props)}
                <div className="w-full flex flex-row justify-between items-center">
                    <span className="w-1/4 text-white mb-4">{day} {this.props.t('from')} {startTime} {this.props.t('till')} {endTime}</span>
                    <span className="w-3/4 text-white mb-4">{text}</span>
                </div>
                <div className="w-full flex flex-row justify-between items-center">

                {(joinable ? 
                    <div className="flex flex-wrap flex-row-reverse justify-start items-center">
                        <button onClick={() => onStart()} className={`px-6 py-1 ml-2 mb-2 rounded-full text-white bg-${getColor(3)}`}>
                            {this.props.t('enterClass')}
                        </button>
                    </div>
                :
                <span className="text-redish mb-4">{this.props.t('notStarted')}</span>
                )}
                </div>
            </div>
        );
    }
}

export default withTranslation()(RecentClassDetail);