import React from 'react';
import Schedule from '../../manager/class/Schedule'
import {getClassSchedule } from '../../../../_actions/classScheduleActions'
import { connect } from 'react-redux';

class Classes extends React.Component {

    componentDidMount = async () =>{
        await this.props.getClassSchedule(this.props.user.token , -1)
    }

    render() {
        return (
            <div className="overflow-auto">
                <Schedule
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