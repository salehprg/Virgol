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
        return this.options.find(x => x.value === dayType).label
    }

    render() {
        const { title, pos , joinList, newBtn, btnAction, classes } = this.props

        return (
            <div className={`${pos} w-full h-full my-4 px-6 py-4 relative text-right bg-dark-blue rounded-xl`}>
                <div className="w-full flex flex-row-reverse justify-between items-center">
                    <p className="text-white">{title}</p>
                    <button onClick={btnAction} className={`px-4 py-1 bg-greenish rounded-lg text-white ${newBtn ? '' : 'hidden'}`}>{this.props.t('createPrivateClass')}</button>
                </div>
                {(classes ? 
                    (
                        classes.length === 0 
                        ? 
                    <span className="text-2xl text-grayish block centerize">{this.props.t('noClassAvailable')}</span>
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
                    <span className="text-2xl text-grayish block text-center">{this.props.t('noClassAvailable')}</span> 
                )
                }
            
            </div>
        );
    }

}

export default withTranslation()(RecentClass);