import React from "react";
import { connect } from 'react-redux';
import { getNewUsers, logout } from "../../../actions";
import {book, check, edit, errorOutline, loading, logoutIcon, remove, verified} from "../../../assets/icons";
import ReactTooltip from "react-tooltip";

class Home extends React.Component {

    state = { query: '' }

    componentDidMount() {
        console.log("comp")
        this.props.getNewUsers(this.props.auth.token);
    }

    renderNewStudents = () => {

        const { newUsers } = this.props;

        if (newUsers !== null) {
            if (newUsers.length === 0) {
                return (
                    <div className="w-full flex-grow flex flex-col justify-center items-center">
                        {errorOutline("w-24 h-24 text-blueish")}
                        <span className="text-xl mt-4 text-dark-blue">هیچ دانش آموزی وجود ندارد</span>
                    </div>
                );
            } else {
                const newUserCards = newUsers.map((student) => {
                    if (
                        student.firstName.includes(this.state.query) ||
                        student.lastName.includes(this.state.query) ||
                        student.melliCode.includes(this.state.query)
                    ) {
                        return (
                            <tr key={student.id}>
                                <td className="py-2">{student.firstName}</td>
                                <td className="py-2">{student.lastName}</td>
                                <td className="py-2">{student.melliCode}</td>
                                <td className="flex flex-row justify-center py-2">
                                    {check("w-8 h-8 mx-2 cursor-pointer transition-all duration-200 hover:text-blueish")}
                                </td>
                            </tr>
                        );
                    }
                })

                return (
                    <table dir="rtl" className="table-auto w-5/6 text-center">
                        <thead>
                        <tr className="border-b-2 border-blueish">
                            <th className="px-8 py-2">نام</th>
                            <th className="px-8 py-2">نام خانوادگی</th>
                            <th className="px-8 py-2">کد ملی</th>
                            <th className="px-8 py-2">احراز هویت</th>
                        </tr>
                        </thead>
                        <tbody>
                        {newUserCards}
                        </tbody>
                    </table>
                );
            }
        }

        return loading("w-16 h-16 text-blueish")
    }

    render() {
        return (
            <div className="w-full h-full pt-12 flex md:flex-row flex-col md:items-start items-center md:justify-end justify-center">
                <ReactTooltip />
                <div className="md:w-2/3 w-5/6 md:mx-4 mx-0 md:mb-0 mb-4 flex flex-col items-end">
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
                <div className="md:w-1/4 w-5/6 md:mb-0 mb-4 flex flex-col justify-between">
                    <div className="bg-white w-full flex flex-col py-2 justify-start items-center overflow-auto">
                        <span className="font-vb text-blueish text-2xl mb-8">اطلاعات شما</span>
                        <span className="text-2xl font-vb w-5/6 text-right">{this.props.auth.userInformation.firstName}</span>
                        <span className="text-2xl font-vb w-5/6 text-right">{this.props.auth.userInformation.lastName}</span>
                        <div className="w-full flex mt-6 flex-row justify-center">
                            <div data-tip="اکانت تایید شده">
                                {verified("w-8 h-8 mx-1 text-golden cursor-pointer")}
                            </div>
                            <div onClick={() => this.props.logout()} data-tip="خروج">
                                {logoutIcon("w-8 h-8 mx-1 text-grayish cursor-pointer transition-all duration-200 hover:text-red-900")}
                            </div>
                        </div>
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

export default connect(mapStateToProps, { getNewUsers, logout })(Home);