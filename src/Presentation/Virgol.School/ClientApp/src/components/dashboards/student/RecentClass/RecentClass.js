import React from "react";
import { withTranslation } from 'react-i18next';
import RecentClassDetail from "./ClassDetail";
import { connect } from "react-redux";

class RecentClass extends React.Component {

    options = [
        { value: 1, label: this.props.t('saturday') },
        { value: 2, label: this.props.t('sunday') },
        { value: 3, label: this.props.t('monsday') },
        { value: 4, label: this.props.t('tuesday') },
        { value: 5, label: this.props.t('wednesday') },
        { value: 6, label: this.props.t('thursday') },
        { value: 7, label: this.props.t('friday') }
    ];

    getDayName = (dayType) => {
        return this.options.find(x => x.value == dayType).label
    }

    render() {
        const { title, pos , joinList , classes} = this.props

        return (
            <div className={`${pos} tw-w-full tw-h-full tw-mt-4 tw-px-6 tw-py-4 tw-text-right tw-bg-dark-blue tw-rounded-xl tw-overflow-auto`}>
                <p className="tw-text-white">{title}</p>
                {(classes ?
                    (
                        classes.length === 0 
                        ? 
                    <span className="tw-text-2xl tw-text-grayish tw-block tw-text-center">{this.props.t('noClassAvailable')}</span> 
                        :
                        classes.map(x => {
                            return (
                                (x.started ? 
                                    <RecentClassDetail
                                        text={x.meetingName}
                                        serviceType={x.serviceType}
                                        schoolName={x.schoolName}
                                        className={x.className}
                                        onStart={() => this.props.onStart(x.meetingId)}
                                        joinable={joinList}
                                        day={this.getDayName(x.dayType)}
                                        startTime={`${~~x.startHour}:${(x.startHour - ~~x.startHour) * 60}`}
                                        endTime={`${~~x.endHour}:${(x.endHour - ~~x.endHour) * 60}`
                                        }
                                    />
                                :
                                    <RecentClassDetail
                                        text={`${x.orgLessonName} - ${x.firstName} ${x.lastName}`}
                                        schoolName={x.schoolName}
                                        className={x.className}
                                        joinable={false}
                                        startTime={`${~~x.startHour}:${(x.startHour - ~~x.startHour) * 60}`}
                                        endTime={`${~~x.endHour}:${(x.endHour - ~~x.endHour) * 60}`
                                        }
                                    />
                                )
                            );
                        })
                    )
                    :
                    <span className="tw-text-2xl tw-text-grayish tw-block tw-text-center">{this.props.t('noClassAvailable')}</span> 
                )
                }
            
            </div>
        );
    }

}

export default withTranslation()(RecentClass);