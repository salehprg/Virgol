import React from "react";
import { withTranslation } from 'react-i18next';
import getColor from "../../../../assets/colors";

class RecentClassDetail extends React.Component {

    render () {
        const {teacherAsStudent , weekly , text,day, startTime , endTime , schoolName , className , onStart , onEnd , joinable, serviceType } = this.props

        return (
            <div className="tw-w-full tw-py-2 tw-mt-6 tw-border-b tw-border-grayish">
                <div className="tw-w-full tw-flex tw-flex-row tw-justify-between tw-items-center">
                    <span className="tw-w-1/3 tw-text-white tw-mb-4">{weekly === 2 ? this.props.t('oddWeek') : weekly === 1 ? this.props.t('evenWeek') : this.props.t('everyWeek')} {day} {this.props.t('from')} {startTime} {this.props.t('till')} {endTime}</span>
                    <span className="tw-w-3/4 tw-text-white tw-mb-4">{text}</span>
                </div>
                <div className="tw-w-full tw-flex tw-flex-row tw-justify-between tw-items-center">
                    <span className="tw-text-grayish tw-text-sm">{schoolName} ({className})</span>
                    
                    <div className="w-2/4 tw-flex tw-flex-wrap tw-flex-row-reverse tw-justify-start tw-items-center">
                        <button onClick={() => onStart()} className={`tw-px-6 tw-py-1 tw-ml-2 tw-mb-2 tw-rounded-full tw-text-white tw-flex tw-flex-row tw-items-center tw-bg-${getColor((joinable ? 3 : 2))}`}>
                            {(joinable || teacherAsStudent ? (teacherAsStudent ? this.props.t("enterRoom") : this.props.t('enterClass')) : this.props.t('createClass'))}
                            {joinable ? 
                                <img className="tw-w-6 tw-mx-2" src={serviceType === 'adobe' ? '/Connect.png' : '/BBB.png'} /> 
                            : 
                            null
                            }
                        </button>
                        {(joinable ? 
                            <button onClick={() => onEnd()} className={`tw-px-6 tw-py-1 tw-ml-2 tw-mb-2 tw-rounded-full tw-text-white tw-bg-${getColor(1)}`}>
                                {this.props.t('endClass')}
                            </button> : null )}
                    </div>
                </div>
            </div>
        );
    }

}

export default withTranslation()(RecentClassDetail);