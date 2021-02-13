import React from "react";
import { withTranslation } from 'react-i18next';
import getColor from "../../../../assets/colors";

class RecentClassDetail extends React.Component {

    render (){
        const { serviceType, text,day , startTime , endTime , schoolName , className , onStart , onEnd , joinable } = this.props

        return (
            <div className="tw-w-full tw-py-2 tw-mt-6 tw-border-b tw-border-grayish">
                <div className="tw-w-full tw-flex tw-flex-row tw-justify-between tw-items-center">
                    <span className="tw-w-1/4 tw-text-white tw-mb-4">{day} {this.props.t('from')} {startTime} {this.props.t('till')} {endTime}</span>
                    <span className="tw-w-3/4 tw-text-white tw-mb-4">{text}</span>
                </div>
                <div className="tw-w-full tw-flex tw-flex-row tw-justify-between tw-items-center">

                {(joinable ? 
                    <div className="tw-flex tw-flex-wrap tw-flex-row-reverse tw-justify-start tw-items-center">
                        <button onClick={() => onStart()} className={`tw-px-6 tw-py-1 tw-ml-2 tw-mb-2 tw-flex tw-flex-row-reverse tw-items-center tw-justify-center tw-rounded-full tw-text-white tw-bg-${getColor(3)}`}>
                            {this.props.t('enterClass')}
                            <img className="tw-w-6 tw-mx-2" src={serviceType === 'adobe' ? '/Connect.png' : '/BBB.png'} />
                        </button>
                    </div>
                :
                <span className="tw-text-redish tw-mb-4">{this.props.t('notStarted')}</span>
                )}
                </div>
            </div>
        );
    }
}

export default withTranslation()(RecentClassDetail);