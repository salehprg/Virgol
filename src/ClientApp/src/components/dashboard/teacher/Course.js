import React from "react";
import faker from "faker";
import { connect } from 'react-redux';
import { getAllCourses } from "../../../actions";
import {book, edit, errorOutline, loading, remove} from "../../../assets/icons";

class Course extends React.Component {

    state = { query: '' }

    componentDidMount() {
        this.props.getAllCourses(this.props.auth.token);
    }

    renderCourses = () => {

        if (this.props.isThereLoading && this.props.loadingComponent === 'GetAllCourses') {
            return loading("w-16 h-16 text-blueish")
        }

        const { courses } = this.props;

        if (courses !== null) {
            const courseCards = courses.map((course) => {
                if (course.shortname.includes(this.state.query) || course.teacherName.includes(this.state.query)) {
                    return (
                        <tr key={course.id}>
                            <td className="py-2">{course.shortname}</td>
                            <td className="py-2">{course.teacherName}</td>
                        </tr>
                    );
                }
            })

            if (!courseCards[0]) {
                return (
                    <div className="w-full flex-grow flex flex-col justify-center items-center">
                        {errorOutline("w-24 h-24 text-blueish")}
                        <span className="text-xl mt-4 text-dark-blue">هیچ مقطعی وجود ندارد</span>
                    </div>
                );
            } else {
                return (
                    <table dir="rtl" className="table-auto w-5/6 text-center">
                        <thead>
                        <tr className="border-b-2 border-blueish">
                            <th className="px-8 py-2">نام</th>
                            <th className="px-8">نام معلم</th>
                        </tr>
                        </thead>
                        <tbody>
                        {courseCards}
                        </tbody>
                    </table>
                );
            }
        }

    }

    render() {
        return (
            <div className="w-full h-full pt-12 flex items-start md:justify-end justify-center">
                <div className="md:w-11/12 w-5/6 flex flex-col items-end">
                    <input
                        value={this.state.query}
                        onChange={(e) => this.setState({ query: e.target.value })}
                        className="md:w-1/3 w-1/2 mb-2 px-4 py-1 rounded-lg text-right text-grayish focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="جست و جو"
                    />
                    <div className="bg-white w-full min-h-75 flex flex-col py-2 justify-start items-center overflow-auto">
                        <span className="font-vb text-blueish text-2xl mb-8">دروس</span>
                        {this.renderCourses()}
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        auth: state.auth.userInfo,
        courses: state.adminData.courses,
        isThereLoading: state.loading.isThereLoading,
        loadingComponent: state.loading.loadingComponent
    }
}

export default connect(mapStateToProps, { getAllCourses })(Course);