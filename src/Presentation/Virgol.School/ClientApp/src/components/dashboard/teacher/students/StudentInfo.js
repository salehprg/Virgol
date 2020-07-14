import React from 'react';
import { connect } from 'react-redux';

class StudentInfo extends React.Component {

    render() {
        const {student} = this.props;
        return (
            <div className="w-screen min-h-screen flex flex-col justify-between items-center">

            </div>
        );
    }

}

const mapStateToProps = (state, myProps) => {
    const student = state.adminData.students.find(el => el.id === parseInt(myProps.match.params.id));
    return {
        token: state.auth.userInfo.token,
        student
    }
}

export default connect(mapStateToProps)(StudentInfo);