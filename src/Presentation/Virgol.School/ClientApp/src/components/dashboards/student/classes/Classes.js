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
                {loading('tw-w-10 tw-text-white centerize')}
            </>
        );
        return (
            <>
            {/* <form ref={this.formRef} className="tw-text-center" action="https://vs.legace.ir/login/index.php" method="POST"  >
                <input
                    name="username"
                    type="text"
                    placeholder="نام کاربری"
                />
                <input
                    name="password"
                    type="text"
                    placeholder="رمز عبور"
                />
                <button className={`tw-w-5/6 tw-mx-auto tw-flex tw-justify-center tw-rounded-lg tw-py-2 focus:tw-outline-none focus:tw-shadow-outline tw-my-8 tw-bg-purplish tw-text-white`}>
                ورود
                </button>
            </form> */}
            <div ref={this.sc} className="tw-overflow-auto">
                <Schedule
                    isTeacher={false}
                    editable={false}
                    // lessons={this.props.schedules}
                    lessons={this.props.schedules}           
                />
            </div>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {user : state.auth.userInfo  , schedules : state.schedules.classSchedules}
}

export default connect(mapStateToProps , {getClassSchedule })(Classes);