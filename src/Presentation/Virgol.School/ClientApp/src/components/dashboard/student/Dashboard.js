import React from 'react';
import { connect } from 'react-redux';
import { getCoursesInCat, getUserCat } from "../../../actions/userActions";
import Loading from "../../Loading";
import {Link} from "react-router-dom";

class Dashboard extends React.Component {

    state = { loading: false, error: false }

    componentDidMount() {
        this.getInfo();
    }

    getInfo = async () => {
        this.setState({loading: true})
        const success = await this.props.getUserCat(this.props.user.token);
        if (success && this.props.userCat[0]) await this.props.getCoursesInCat(this.props.userCat.id, this.props.user.token);
        else this.setState({ error: true })
        this.setState({loading: false})
    }

    renderCourses = () => {
        if (this.props.courses) {
            return this.props.courses.map(course => {
                return(
                    <div key={course.name} className="w-5/6 max-w-300 sm:ml-12 ml-0 mb-12 py-4 bg-white flex flex-col items-center">
                        <span className="text-2xl text-blueish font-vb text-center">{course.name}</span>
                        <span className="my-4 text-center" dir="rtl">{course.teacher}</span>
                        <Link className="w-5/6 py-2 bg-golden text-center font-vb text-dark-green rounded-full" to={course.link}>لینک درس</Link>
                    </div>
                );
            })
        }
    }

    render() {
        if (this.state.loading) return <Loading />;
        if (this.props.error || !this.props.userCat) return (
            <div className="w-screen h-screen flex justify-center items-center">
                <button onClick={this.getInfo}>تلاش مجدد</button>
            </div>
        )
        return (
            <div className="w-screen min-h-screen bg-light-white flex flex-col justify-center items-center">
                <div className="w-full my-2 flex md:flex-row flex-col justify-center items-stretch">
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
                        <span className="text-2xl text-white my-2">{this.props.userCat[0] ? this.props.userCat[0].name : 'ندارد'}</span>
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

export default connect(mapStateToProps, { getCoursesInCat, getUserCat })(Dashboard);