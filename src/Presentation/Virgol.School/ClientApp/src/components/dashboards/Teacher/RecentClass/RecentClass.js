import React from "react";
import { withTranslation } from 'react-i18next';
import RecentClassDetail from "./ClassDetail";
import StudentClassDetail from "../../student/RecentClass/ClassDetail";
import PrivateClass from "./PrivateClass";

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
        var day = this.options.find(x => x.value == dayType)
        if(day)
            return day.label

        return ''
    }

    render() {
        const { title, pos , joinList, newBtn, btnAction, classes } = this.props

        return (
            <div className={`${pos} tw-w-full tw-h-full tw-my-4 tw-px-6 tw-py-4 tw-relative tw-text-right tw-bg-dark-blue tw-rounded-xl`}>
                <div className="tw-w-full tw-flex tw-flex-row-reverse tw-justify-between tw-items-center">
                    <p className="tw-text-white">{title}</p>
                    <button onClick={btnAction} className={`tw-px-4 tw-py-1 tw-bg-greenish tw-rounded-lg tw-text-white ${newBtn ? '' : 'tw-hidden'}`}>{this.props.t('createPrivateClass')}</button>
                </div>
                {(classes ? 
                    (
                        classes.length === 0 
                        ? 
                    <span className="tw-text-xl tw-text-grayish tw-block ">{this.props.t('noClassAvailable')}</span>
                        :
                        classes.map(x => {
                            return (
                                (!x.private ?
                                    (x.teacherAsStudent ? 
                                        (x.started ? 
                                            <StudentClassDetail
                                                text={x.meetingName}
                                                serviceType={x.serviceType}
                                                schoolName={x.schoolName}
                                                className={x.className}
                                                onStart={() => this.props.onJoin(x.meetingId)}
                                                joinable={true}
                                                day={this.getDayName(x.dayType)}
                                                startTime={`${~~x.startHour}:${(x.startHour - ~~x.startHour) * 60}`}
                                                endTime={`${~~x.endHour}:${(x.endHour - ~~x.endHour) * 60}`
                                                }
                                            />
                                        :
                                            <StudentClassDetail
                                                text={`${x.orgLessonName} - ${x.firstName} ${x.lastName}`}
                                                schoolName={x.schoolName}
                                                className={x.className}
                                                joinable={false}
                                                startTime={`${~~x.startHour}:${(x.startHour - ~~x.startHour) * 60}`}
                                                endTime={`${~~x.endHour}:${(x.endHour - ~~x.endHour) * 60}`
                                                }
                                            />
                                        )
                                    :
                                    <RecentClassDetail
                                        teacherAsStudent={x.teacherAsStudent}
                                        weekly={x.weekly}
                                        serviceType={x.serviceType}
                                        text={(joinList ? x.meetingName : x.orgLessonName)}
                                        schoolName={x.schoolName}
                                        className={x.className}
                                        onStart={() => (x.teacherAsStudent ? this.props.onJoin(x.id) : this.props.onStart(x.id))}
                                        onEnd={() => this.props.onEnd(x.id)}
                                        day={this.getDayName(x.dayType)}
                                        joinable={joinList}
                                        startTime={`${~~x.startHour}:${((x.startHour - ~~x.startHour) * 60 == 0 ? '00' : (x.startHour - ~~x.startHour) * 60)}`}
                                        endTime={`${~~x.endHour}:${((x.endHour - ~~x.endHour) * 60 == 0 ? '00' : (x.endHour - ~~x.endHour) * 60)}`
                                        }
                                    />
                                    )
                                :
                                <PrivateClass
                                    text={(joinList ? x.meetingName : x.orgLessonName)}
                                    onStart={() => this.props.onJoinPrivate(x.meetingId)}
                                    onEnd={() => this.props.onEnd(x.meetingId)}
                                    guid={x.meetingId}
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