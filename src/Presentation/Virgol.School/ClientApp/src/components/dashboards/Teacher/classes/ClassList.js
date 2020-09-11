import React from "react";
import { connect } from "react-redux";
import {getTeacherSchedule } from '../../../../_actions/classScheduleActions'
import ClassCard from "./ClassCard";

class ClassList extends React.Component {

    state = {classesLists : null}

    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.getTeacherSchedule(this.props.user.token )
        this.setState({ loading: false })

        const _classesLists = [];

        this.props.schedules.map(day => {
            if(day && day.length > 0)
            {
                (day.map(x => {
                    _classesLists.push(x)
                }))
            }
        })

        this.setState({classesLists : _classesLists})
    }

    render() {
        return (
            <div className="grid my-8 teacher-classes-cards">
                {(this.state.classesLists ? 
                this.state.classesLists.map(x => {
                    return(
                        <ClassCard
                            lessonId={x.lessonId}
                            scheduleId={x.id}
                            title={x.orgLessonName}
                            school={x.schoolName}
                            nameOfClass={x.className}
                        />
                    )
                })
                : "درحال بارگداری ..." )}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user : state.auth.userInfo  , schedules : state.schedules.classSchedules}
}

export default connect(mapStateToProps , {getTeacherSchedule })(ClassList);