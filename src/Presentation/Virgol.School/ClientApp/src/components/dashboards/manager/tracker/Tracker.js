import React, {createRef} from "react";
import GridLayout from "react-grid-layout";
import { connect } from "react-redux";
import protectedManager from "../../../protectedRoutes/protectedManager";
import {GetAllActiveMeeting} from '../../../../_actions/meetingActions'
import getColor from "../../../../assets/colors";
import TrackerLessonInfo from "./TrackerLessonInfo";

class Tracker extends React.Component {

    state = {layout: [
            {i: "t1", name: "07:00", x: 26, y: 0, w: 2, h: 1, static: true},
            {i: "t2", name: "08:00", x: 24, y: 0, w: 2, h: 1, static: true},
            {i: "t3", name: "09:00", x: 22, y: 0, w: 2, h: 1, static: true},
            {i: "t4", name: "10:00", x: 20, y: 0, w: 2, h: 1, static: true},
            {i: "t5", name: "11:00", x: 18, y: 0, w: 2, h: 1, static: true},
            {i: "t6", name: "12:00", x: 16, y: 0, w: 2, h: 1, static: true},
            {i: "t7", name: "13:00", x: 14, y: 0, w: 2, h: 1, static: true},
            {i: "t8", name: "14:00", x: 12, y: 0, w: 2, h: 1, static: true},
            {i: "t9", name: "15:00", x: 10, y: 0, w: 2, h: 1, static: true},
            {i: "t10", name: "16:00", x: 8, y: 0, w: 2, h: 1, static: true},
            {i: "t11", name: "17:00", x: 6, y: 0, w: 2, h: 1, static: true},
            {i: "t12", name: "18:00", x: 4, y: 0, w: 2, h: 1, static: true},
            {i: "t13", name: "19:00", x: 2, y: 0, w: 2, h: 1, static: true},
            {i: "t14", name: "20:00", x: 0, y: 0, w: 2, h: 1, static: true}
    ],
    lessonInfo: null , showLessonInfo : false , lessons : []}
    sc = createRef()

    handleLessonLayout = () => {
        var schedules = [];
    
        this.props.acticeMeeting.map((classs , index) => {
            if(classs && classs.length > 0)
            {
                (classs.map(lesson => {
                    schedules.push({i: 'l' + lesson.id , name: lesson.orgLessonName, 
                    c: `bg-${getColor(lesson.lessonId)} border-none cursor-pointer`, x: 28 - ((lesson.endHour - 7) * 2), y: index + 1, w: (lesson.endHour - lesson.startHour) * 2,
                    h: 1 , lessonDetail : lesson , static: true})
                }))
            }
        })
        
        this.props.acticeMeeting.map((classs , index) => {
            schedules.push({i: 'c' + classs[0].classId, name: 'کلاس ' + classs[0].className,x: 28 , y: index + 1, w: 2, h: 1 , static: true})
        })
                

        this.setState({lessons : schedules})
    } 

    componentDidMount = async () => {
        this.sc.current.scrollLeft = this.sc.current.clientWidth

        await this.props.GetAllActiveMeeting(this.props.user.token)

        if(this.props.acticeMeeting)
        {
            this.handleLessonLayout()
        }
    }

    showLessonInfo = (id) => {
        if (!this.state.lessons.find(el => el.i === id) || this.state.lessons.find(el => el.i === id).i.includes('c')) return;
        this.setState({ lessonInfo: this.state.lessons.find(el => el.i === id) , showLessonInfo : true})
    }

    onCancel = () => {
        this.setState({ lessonInfo: null , showLessonInfo : false})
    }


    render() {
        const layout = this.state.layout.concat(this.state.lessons);
        return (
            <>
                {this.state.showLessonInfo ? 
                <TrackerLessonInfo
                    isManager={this.props.isManager}
                    isTeacher={this.props.isTeacher}
                    lessonInfo={this.state.lessonInfo}
                    cancel={() => this.onCancel()}
                    canEdit={this.props.editable}
                    onDelete={() => this.deleteLesson()}
                /> 
                : 
                null
                }
                <div className="w-full mt-10">
                    <div ref={this.sc} className="w-11/12 p-4 mx-auto rounded-lg min-h-70 border-2 border-dark-blue overflow-auto">
                        <GridLayout className="layout" layout={layout} cols={30} rowHeight={50} width={1800}>
                            {layout.map(x => {
                                return (
                                    <div onClick={() => this.showLessonInfo(x.i)} className={`pointer border border-white text-center text-white ${x.c}`} key={x.i}>
                                        <p className="text-center">{x.name}</p>
                                    </div>
                                );
                            })}
                        </GridLayout>
                    </div>
                </div>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {user : state.auth.userInfo  ,  acticeMeeting : state.meetingData.activeMeetings}
}

const authWrapped = protectedManager(Tracker)

export default connect(mapStateToProps , {GetAllActiveMeeting})(authWrapped);