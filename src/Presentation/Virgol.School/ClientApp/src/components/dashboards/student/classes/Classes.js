import React, {createRef} from 'react';
import Schedule from '../../manager/class/Schedule'
import {getClassSchedule } from '../../../../_actions/classScheduleActions'
import { connect } from 'react-redux';
import { loading } from '../../../../assets/icons'

class Classes extends React.Component {

    state = { loading: false }
    sc = createRef()

    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.getClassSchedule(this.props.user.token , -1)
        this.setState({ loading: false })
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
    return {user : state.auth.userInfo  , schedules : state.schedules.classSchedules}
}

export default connect(mapStateToProps , {getClassSchedule })(Classes);