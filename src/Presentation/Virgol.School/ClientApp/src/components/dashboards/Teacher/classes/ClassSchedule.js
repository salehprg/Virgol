import React, {createRef} from 'react';
import Schedule from '../../manager/class/Schedule'
import {getTeacherSchedule } from '../../../../_actions/classScheduleActions'
import { connect } from 'react-redux';
import { loading } from '../../../../assets/icons'

class ClassSchedule extends React.Component {

    state = { loading: false , finished : true, schedules: null }
    sc = createRef()

    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.getTeacherSchedule(this.props.user.token )

        const uniques = [];
        this.props.schedules.map(day => {
            const temp = [];
            day.map(lesson => {
                if (!temp.filter(e => e.mixedId === lesson.mixedId ).length > 0 || lesson.mixedId === 0) {
                    temp.push(lesson);
                }
            })
            uniques.push(temp);
        })

        this.setState({ loading: false, schedules: uniques })

        this.setState({finished : true})
        this.render()
        this.sc.current.scrollLeft = this.sc.current.clientWidth
    }

    render() {
        if (this.state.loading || !this.state.schedules) return (
            <>
                {loading('tw-w-10 tw-text-grayish centerize')}
            </>
        );
        
        return (
            <div ref={this.sc} className="tw-overflow-auto">
                <Schedule
                    isTeacher={false}
                    editable={false}
                    // lessons={this.props.schedules}
                    lessons={this.state.schedules}           
                />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user : state.auth.userInfo  , schedules : state.schedules.classSchedules}
}

export default connect(mapStateToProps , {getTeacherSchedule })(ClassSchedule);