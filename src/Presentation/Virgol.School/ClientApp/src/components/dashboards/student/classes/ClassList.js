import React from "react";
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";
import {GetScheduleList } from '../../../../_actions/teacherActions'
import ClassCard from "./ClassCard";

class ClassList extends React.Component {

    state = {classesLists : []}

    componentDidMount = async () => {
        // this.setState({ loading: true })
        // await this.props.GetScheduleList(this.props.user.token )
        // this.setState({ loading: false })

        // const _classesLists = [];

        // this.props.schedules.map(day => {
        //     if(day && day.length > 0)
        //     {
        //         (day.map(x => {
        //             _classesLists.push(x)
        //         }))
        //     }
        // })

        // this.setState({classesLists : _classesLists})
    }

    render() {
        return (
            <div className="grid my-8 teacher-classes-cards">
                {(this.state.classesLists ? 
                this.props.schedules.map(x => {
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
    return {user : state.auth.userInfo  , schedules : state.teacherData.scheduleList}
}
const cwrapped = connect(mapStateToProps , {GetScheduleList })(ClassList);

export default withTranslation()(cwrapped);