import React from 'react';
import { connect } from 'react-redux';
import Feed from "../../feed/Feed";
import InfoBoard from "../../infoboard/InfoBoard";
import protectedManager from "../../../protectedRoutes/protectedManager";
import {backpack, ruler} from "../../../../assets/icons";

class Home extends React.Component {

    render() {
        if (!this.props.students || !this.props.teachers) return null
        return (
            <div className="w-full flex xl:flex-row-reverse flex-col justify-between">
                <div className="xl:w-3/5 mx-2 w-full rounded-lg h-85 bg-white overflow-auto">
                    <Feed />
                </div>

                <div className="xl:w-2/5 mx-2 w-full xl:h-85 h-auto flex flex-col justify-between items-center">
                    <InfoBoard user={this.props.user} isManager={true} />

                    <div className="w-full flex flex-row justify-evenly items-center">
                        <div className="w-5/12 py-6 rounded-xl bg-white flex flex-col justify-evenly items-center">
                            <div className="w-1/2 py-2 rounded-xl bg-lighter-blueish flex justify-center items-center">
                                {backpack("w-16 text-blueish")}
                            </div>
                            <span className="text-grayish my-4">تعداد دانش آموزان</span>
                            <span className="text-2xl font-vb">{this.props.students.length}</span>
                        </div>
                        <div className="w-5/12 py-6 rounded-xl bg-white flex flex-col justify-evenly items-center">
                            <div className="w-1/2 py-2 rounded-xl bg-green-light flex justify-center items-center">
                                {ruler("w-16 text-green")}
                            </div>
                            <span className="text-grayish my-4">تعداد معلمان</span>
                            <span className="text-2xl font-vb">{this.props.teachers.length}</span>
                        </div>
                    </div>
                    <div className="w-full ">

                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        user: state.auth.userInfo,
        students: state.managerData.students,
        teachers: state.managerData.teachers
    }
}

const authWrapped = protectedManager(Home)
export default connect(mapStateToProps)(authWrapped);