import React from "react";
import faker from 'faker';
import { connect } from 'react-redux';
import { getNewUsers } from "../../../actions";
import {check, errorOutline, loading} from "../../../assets/icons";

class Home extends React.Component {

    state = { query: '' }

    componentDidMount() {
        this.props.getNewUsers(this.props.auth.token);
    }

    renderNewStudents = () => {
        const { newUsers } = this.props;

        if (newUsers !== null) {
            if (newUsers.length === 0) {
                return (
                    <div className="w-full flex-grow flex flex-col justify-center items-center">
                        {errorOutline("w-24 h-24 text-blueish")}
                        <span className="text-xl mt-4 text-dark-blue">هیچ دانش آموز جدیدی وجود ندارد</span>
                    </div>
                );
            }
        }

        return loading("w-16 h-16 text-blueish")

        // else
    }

    renderNewStudent = () => {
        const data = false;
        if (data) {

            let students = [];
            for (let i = 0; i < 4; i++) {
                students.push(
                    <React.Fragment>
                        <tr>
                            <td className="py-2">{faker.name.firstName()}</td>
                            <td className="py-2">{faker.name.lastName()}</td>
                            <td className="py-2">{faker.random.number()}</td>
                            <td className="flex justify-center py-2">{check("w-8 h-8 cursor-pointer transition-all duration-200 hover:text-blueish")}</td>
                        </tr>
                    </React.Fragment>
                );
            }

            return (
                <table dir="rtl" className="table-auto w-5/6 text-center">
                    <thead>
                    <tr className="border-b-2 border-blueish">
                        <th className="px-8 py-2">نام</th>
                        <th className="px-8">نام خانوادگی</th>
                        <th className="px-8">کد ملی</th>
                        <th className="px-8">احراز هویت</th>
                    </tr>
                    </thead>
                    <tbody>
                        {students}
                    </tbody>
                </table>
            );

        } else {
            return (
                <div className="w-full flex-grow flex flex-col justify-center items-center">
                    {errorOutline("w-24 h-24 text-blueish")}
                    <span className="text-xl mt-4 text-dark-blue">هیچ دانش آموز جدیدی وجود ندارد</span>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="w-full h-full pt-12 flex items-start justify-center">
                <div className="md:w-3/4 w-5/6 flex flex-col items-end">
                    <input
                        value={this.state.query}
                        onChange={(e) => this.setState({ query: e.target.value })}
                        className="md:w-1/3 w-1/2 mb-2 px-4 py-1 rounded-lg text-right text-grayish focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="جست و جو"
                    />
                    <div className="bg-white w-full min-h-75 flex flex-col py-2 justify-start items-center overflow-auto">
                        <span className="font-vb text-blueish text-2xl mb-8">دانش آموزان جدید</span>
                        {this.renderNewStudents()}
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        auth: state.auth.userInfo,
        newUsers: state.adminData.newUsers,
        isThereLoading: state.loading.isThereLoading,
        loadingComponent: state.loading.loadingComponent
    }
}

export default connect(mapStateToProps, { getNewUsers })(Home);