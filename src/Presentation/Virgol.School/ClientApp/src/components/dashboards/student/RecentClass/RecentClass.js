import React from "react";
import RecentClassDetail from "./ClassDetail";
import { connect } from "react-redux";

class RecentClass extends React.Component {


    render() {
        const { title, pos , joinList , classes} = this.props

        return (
            <div className={`${pos} w-full h-full mt-4 px-6 py-4 text-right bg-dark-blue rounded-xl`}>
                <p className="text-white">{title}</p>
                {(classes ? 
                    (
                        classes.length === 0 
                        ? 
                        <span className="text-2xl text-grayish block text-center">هیچ کلاسی وجود ندارد</span> 
                        :
                        classes.map(x => {
                            return (
                                (x.started ? 
                                    <RecentClassDetail
                                        text={x.meetingName}
                                        schoolName={x.schoolName}
                                        className={x.className}
                                        onStart={() => this.props.onStart(x.bbB_MeetingId)}
                                        joinable={joinList}
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
                    <span className="text-2xl text-grayish block text-center">هیچ کلاسی وجود ندارد</span> 
                )
                }
            
            </div>
        );
    }

}

export default RecentClass