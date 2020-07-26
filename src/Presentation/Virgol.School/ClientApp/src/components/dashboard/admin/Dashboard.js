import React from 'react';
import { connect } from 'react-redux';
import TopCard from "./TopCard";
import {edit, remove, school, students, teachers} from "../../../assets/icons";
import ReactTooltip from "react-tooltip";
import Loading from "../../Loading";

class Dashboard extends React.Component {

    state = { query: '', loading: false }

    handleSearch = (query) => {
        this.setState({ query })
    }

    managers = [
        { name: 'سید محمد موسوی', schoolName: 'هاشمی نژاد 2', status: 'active' },
        { name: 'مجتبی توکلی', schoolName: 'امام علی (ع)', status: 'suspend' },
        { name: 'حامد بارانی', schoolName: 'آریو مصلی نژاد', status: 'active' },
        { name: 'زهرا ساداتی', schoolName: 'آرمینه مصلی نژاد', status: 'pending' }
    ]

    renderManagers = () => {
        return this.managers.map(manager => {
            return (
                <tr key={manager.name}>
                    <td className="py-2">{manager.name}</td>
                    <td className="py-2">{manager.schoolName}</td>
                    <td className="py-2">{manager.status}</td>
                    <td className="flex flex-col items-center py-2">
                        <div className="flex flex-row justify-center">
                            <div data-tip="ویرایش">
                                {edit("w-8 h-8 mx-2 cursor-pointer transition-all duration-200 hover:text-blueish")}
                            </div>
                            <div data-tip="حذف">
                                {remove("w-8 h-8 mx-2 cursor-pointer transition-all duration-200 hover:text-blueish")}
                            </div>
                        </div>
                    </td>
                </tr>
            );
        })
    }

    render() {
        if (this.state.loading) return <Loading />
        return (
            <div className="w-screen min-h-screen bg-light-white">
                <ReactTooltip />
                <div className="w-5/6 mx-auto py-8">
                    <div className="w-full flex mb-8 flex-row-reverse flex-wrap justify-between items-center">
                        <TopCard
                            icon={teachers("w-16 text-blueish")}
                            title="تعداد مدیران"
                            number="52"
                        />
                        <TopCard
                            icon={school("w-16 text-blueish")}
                            title="تعداد مدارس فعال"
                            number="39"
                        />
                        <TopCard
                            icon={students("w-16 text-blueish")}
                            title="تعداد دانش آموزان"
                            number="425"
                        />
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <button className="px-4 py-1 flex justify-center text-white text-xl items-center bg-green-500">
                            افزودن مدیر
                        </button>
                        <input
                            className="md:w-1/3 w-1/2 mb-2 px-4 py-1 rounded-lg text-right text-grayish focus:outline-none focus:shadow-outline"
                            type="text"
                            placeholder="جست و جو"
                            value={this.state.query}
                            onChange={(e) => this.handleSearch(e.target.value)}
                        />
                    </div>
                    <div className="w-full py-4 bg-white mx-auto">
                        <table dir="rtl" className="table-auto mx-auto w-5/6 text-center">
                            <thead>
                            <tr className="border-b-2 border-blueish">
                                <th className="px-8 py-2">نام</th>
                                <th className="px-8 py-2">مدرسه</th>
                                <th className="px-8">وضعیت</th>
                                <th className="px-8"> </th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.renderManagers()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        auth: state.auth.userInfo
    }
}

export default connect(mapStateToProps)(Dashboard);