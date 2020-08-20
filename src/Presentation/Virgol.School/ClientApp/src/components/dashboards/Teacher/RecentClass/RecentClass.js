import React from "react";
import RecentClassDetail from "./ClassDetail";
import { connect } from "react-redux";

class RecentClass extends React.Component {


    render() {
        const { title, pos , joinList } = this.props

        return (
            <div className={`${pos} w-full h-full my-4 px-6 py-4 text-right bg-dark-blue rounded-xl`}>
                <p className="text-white">{title}</p>
                {(this.props.class ? 
                    (
                        this.props.class.length === 0 
                        ? 
                        <span className="text-2xl text-grayish block text-center">هیچ کلاسی وجود ندارد</span> 
                        :
                        this.props.class.map(x => {
                            return (
                                <RecentClassDetail
                                    text={(joinList ? x.meetingName : x.meetingDetail.orgLessonName)}
                                    schoolName={x.schoolName}
                                    className={x.className}
                                    onStart={() => this.props.onStart((joinList ? x.bbB_MeetingId : x.meetingDetail.id))}
                                    onEnd={() => this.props.onEnd((joinList ? x.bbB_MeetingId : 0))}
                                    joinable={joinList}
                                    startTime={`${~~x.meetingDetail.startHour}:${((x.meetingDetail.startHour - ~~x.meetingDetail.startHour) * 60 == 0 ? '00' : (x.meetingDetail.startHour - ~~x.meetingDetail.startHour) * 60)}`}
                                    endTime={`${~~x.meetingDetail.endHour}:${((x.meetingDetail.endHour - ~~x.meetingDetail.endHour) * 60 == 0 ? '00' : (x.meetingDetail.endHour - ~~x.meetingDetail.endHour) * 60)}`
                                    }
                                />
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