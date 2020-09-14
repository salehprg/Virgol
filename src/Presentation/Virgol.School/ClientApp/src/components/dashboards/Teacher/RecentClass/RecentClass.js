import React from "react";
import RecentClassDetail from "./ClassDetail";
import PrivateClass from "./PrivateClass";

class RecentClass extends React.Component {

    options = [
        { value: 1, label: 'شنبه' },
        { value: 2, label: 'یکشنبه' },
        { value: 3, label: 'دوشنبه' },
        { value: 4, label: 'سه شنبه' },
        { value: 5, label: 'چهار شنبه' },
        { value: 6, label: 'پنجشنبه' },
        { value: 7, label: 'جمعه' }
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
                    <button onClick={btnAction} className={`px-4 py-1 bg-greenish rounded-lg text-white ${newBtn ? '' : 'hidden'}`}>ایجاد کلاس خصوصی</button>
                </div>
                {(classes ? 
                    (
                        classes.length === 0 
                        ? 
                        <span className="text-2xl text-grayish block centerize">هیچ کلاسی وجود ندارد</span>
                        :
                        classes.map(x => {
                            return (
                                (x.classId ?
                                <RecentClassDetail
                                    text={(joinList ? x.meetingName : x.orgLessonName)}
                                    schoolName={x.schoolName}
                                    className={x.className}
                                    onStart={() => this.props.onStart(x.id)}
                                    onEnd={() => this.props.onEnd(x.id)}
                                    day={this.getDayName(x.dayType)}
                                    joinable={joinList}
                                    startTime={`${~~x.startHour}:${((x.startHour - ~~x.startHour) * 60 == 0 ? '00' : (x.startHour - ~~x.startHour) * 60)}`}
                                    endTime={`${~~x.endHour}:${((x.endHour - ~~x.endHour) * 60 == 0 ? '00' : (x.endHour - ~~x.endHour) * 60)}`
                                    }
                                />
                                :
                                <PrivateClass
                                    text={(joinList ? x.meetingName : x.orgLessonName)}
                                    onStart={() => this.props.onStart(x.id)}
                                    onEnd={() => this.props.onEnd(x.bbB_MeetingId)}
                                    guid={x.bbB_MeetingId}
                                />
                                )
                            );
                        })
                    )
                    :
                    <span className="text-2xl text-grayish block text-center">هیچ کلاسی وجود ندارد</span> 
                )
                }
            
            </div>
        );
    }

}

export default RecentClass;