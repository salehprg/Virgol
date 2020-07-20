import React from 'react';
import { connect } from 'react-redux';
import { getCoursesInCat, getUserCat } from "../../../actions/userActions";
import { logout } from "../../../actions";
import Loading from "../../Loading";
import {Link} from "react-router-dom";
import {logoutIcon} from "../../../assets/icons";

class Dashboard extends React.Component {

    state = { loading: true, error: false }

    componentDidMount() {
        this.getInfo();
    }

    getInfo = async () => {
        this.setState({loading: true})
        if (this.props.user.baseId) {
            await this.props.getCoursesInCat(this.props.user.baseId, this.props.user.token)
        } else {
            this.setState({ error: true })
        }
        this.setState({loading: false})
    }

    renderCourses = () => {
        if (this.props.courses) {
            return this.props.courses.map(course => {
                return(
                    <div key={course.name} className="w-5/6 px-2 max-w-300 sm:ml-12 ml-0 mb-12 py-4 bg-white flex flex-col justify-between items-center">
                        <span className="text-2xl text-blueish font-vb text-center">{course.shortname}</span>
                        <span className="my-4 text-center" dir="rtl">{course.teacherName}</span>
                        <a href={course.courseUrl} className="w-5/6 py-2 bg-golden text-center font-vb text-dark-green rounded-full">لینک درس</a>
                    </div>
                );
            })
        }
    }

    render() {
        if (this.state.loading) return <Loading />;
        if (this.state.error || !this.props.userCat) return (
            <div className="w-screen h-screen flex justify-center items-center">
                <button onClick={this.getInfo}>تلاش مجدد</button>
            </div>
        )
        return (
            <div className="w-screen min-h-screen bg-light-white flex flex-col justify-center items-center">
                <div className="w-full my-2 flex md:flex-row flex-col justify-center md:items-stretch items-center">
                    <div className="w-5/6 p-8 flex flex-row flex-wrap justify-evenly items-center max-w-600 mx-2 md:my-0 my-2 rounded-lg bg-white">
                        <div className="w-1/2 my-4 min-w-90">
                            <div className="flex flex-col justify-center items-center">
                                <span className="text-xl text-center text-blueish font-vb">نام</span>
                                <span className="text-center">{this.props.user.userInformation.firstName}</span>
                            </div>
                        </div>
                        <div className="w-1/2 my-4 min-w-90">
                            <div className="flex flex-col justify-center items-center">
                                <span className="text-xl text-center text-blueish font-vb">نام خانوادگی</span>
                                <span className="text-center">{this.props.user.userInformation.lastName}</span>
                            </div>
                        </div>
                        <div className="w-1/2 my-4 min-w-90">
                            <div className="flex flex-col justify-center items-center">
                                <span className="text-xl text-center text-blueish font-vb">کد ملی</span>
                                <span className="text-center">{this.props.user.userInformation.melliCode}</span>
                            </div>
                        </div>
                        <div className="w-1/2 my-4 min-w-90">
                            <div className="flex flex-col justify-center items-center">
                                <span className="text-xl text-center text-blueish font-vb">شماره همراه</span>
                                <span className="text-center">{this.props.user.userInformation.phoneNumber}</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-5/6 flex flex-col justify-center items-center max-w-300o mx-2 md:my-0 my-2 rounded-lg bg-blueish">
                        <span className="text-4xl text-white my-2">مقطع</span>
                        <span className="text-2xl text-white my-2">{this.props.userCat ? this.props.userCat.name : 'ندارد'}</span>
                        <div onClick={() => this.props.logout()} data-tip="خروج">
                            {logoutIcon("w-8 h-8 mx-1 text-white cursor-pointer transition-all duration-200 hover:text-red-900")}
                        </div>
                    </div>
                </div>
                <div className="w-5/6 my-2 p-4 flex flex-row flex-wrap justify-center">
                    {this.renderCourses()}
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        user: state.auth.userInfo,
        userCat: state.userInfo.userCat,
        courses: state.userInfo.courses,
        error: state.userInfo.error
    }
}

export default connect(mapStateToProps, { getCoursesInCat, getUserCat, logout })(Dashboard);