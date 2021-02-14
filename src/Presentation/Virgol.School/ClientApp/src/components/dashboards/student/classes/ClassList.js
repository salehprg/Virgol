import React from "react";
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";
import {GetGroupedSchedule } from '../../../../_actions/classScheduleActions'
import ClassCard from "./ClassCard";

class ClassList extends React.Component {

    state = {classesLists : []}

    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.GetGroupedSchedule(this.props.user.token , this.props.user.userDetail.userDetail.classDetail.id )
        this.setState({ loading: false })

        const _classesLists = [];

        this.props.groupedSchedule.map(day => {
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
            <div className="tw-grid tw-my-8 teacher-classes-cards">
                {(this.state.classesLists ? 
                this.props.groupedSchedule.map(x => {
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
                : this.props.t('loading') )}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user : state.auth.userInfo  , groupedSchedule : state.schedules.groupedSchedule}
}
const cwrapped = connect(mapStateToProps , {GetGroupedSchedule })(ClassList);

export default withTranslation()(cwrapped);