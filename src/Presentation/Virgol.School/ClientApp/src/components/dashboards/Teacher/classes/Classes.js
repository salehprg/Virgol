import React, {createRef} from 'react';
import Schedule from '../../manager/class/Schedule'
import {getTeacherSchedule } from '../../../../_actions/classScheduleActions'
import {GetRecentClass} from "../../../../_actions/meetingActions"
import { connect } from 'react-redux';
import { loading } from '../../../../assets/icons'

class Classes extends React.Component {

    state = { loading: false , finished : true }
    sc = createRef()

    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.getTeacherSchedule(this.props.user.token )

        await this.props.GetRecentClass(this.props.user.token);

        this.setState({ loading: false })

        this.setState({finished : true})
        this.render()
        this.sc.current.scrollLeft = this.sc.current.clientWidth
    }

    render() {
        if (this.state.loading) return (
            <>
                {loading('w-10 text-white centerize')}
            </>
        );
        return (
            <div ref={this.sc} className="overflow-auto">
                <Schedule
                    student={true}
                    editable={false}
                    // lessons={this.props.schedules}
                    lessons={this.props.schedules}           
                />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user : state.auth.userInfo  , schedules : state.schedules.classSchedules , recentClass2 : state.meetingData.recentClass}
}

export default connect(mapStateToProps , {getTeacherSchedule , GetRecentClass})(Classes);