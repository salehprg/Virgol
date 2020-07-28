import React from 'react';
import { connect } from 'react-redux';
import { getAllStudents, confirmUser } from "../../../../_actions/managerActions";
import SearchBar from "../../SearchBar";
import {check, edit, loading, minus, remove, verified} from "../../../../assets/icons";
import protectedManager from "../../../protectedRoutes/protectedManager";
import Table from "../../table/Table";
import Checkbox from "../../table/Checkbox";
import history from "../../../../history";

class Students extends React.Component {

    state = { loading: false, searchQuery: '', selectedItems: [], confirmItems: [], tab: 'verified' }

    async componentDidMount() {
        if (this.props.history.action === 'POP' ||this.props.location.type === 'confirmed' || !this.props.students) {
            this.setState({loading: true})
            await this.props.getAllStudents(this.props.user.token);
            this.setState({loading: false})
        }
    }

    search = (query) => {
        this.setState({ searchQuery: query })
    }

    renderContent = () => {
        if (!this.props.students) return null;
        if (this.props.students.length === 0) return (
            <span className="text-2xl text-grayish block text-center">هیچ مقطعی وجود ندارد</span>
        );
        return (
            <div className="w-11/12 mx-auto mt-12">
                <div className="w-full flex flex-row justify-end items-center">
                    <button onClick={() => this.setState({ tab: 'pending' })} className={`${this.state.tab === 'pending' ? 'bg-magneta text-white' : 'bg-white'} shadow-2xl flex flex-row items-center py-1 px-4 rounded-t-xl focus:outline-none`}>
                        <span className={`${this.props.newUsers.length === 0 ? 'hidden' : 'block'} w-6 h-6 mx-2 rounded-full flex justify-center items-center ${this.state.tab === 'pending' ? 'bg-white text-red-600' : 'bg-red-600 text-white'}`}>{this.props.newUsers.length}</span>
                        دانش آموزان در انتظار تایید
                    </button>
                    <button onClick={() => this.setState({ tab: 'verified' })} className={`${this.state.tab === 'verified' ? 'bg-magneta text-white' : 'bg-white'} shadow-2xl py-1 px-4 ml-2 rounded-t-xl focus:outline-none`}>دانش آموزان تاییده شده</button>
                </div>
                {this.state.tab === 'verified' ?
                    <Table
                        headers={['نام', 'نام خانوادگی', 'کد ملی', 'شماره همراه']}
                        selected={this.state.selectedItems}
                        checkAll={this.checkAll}
                        clearItems={this.clearItems}
                        options={() => {
                            return (
                                <React.Fragment>
                                    <div className="flex justify-between mx-1 cursor-pointer items-center bg-red-700 rounded-full md:px-6 px-3 py-1">
                                        {remove("w-6 mx-1 text-white")}
                                        <span className="font-vb mx-1 text-white">حذف</span>
                                    </div>
                                    {this.state.selectedItems.length === 1 ?
                                        <div onClick={() => history.push(`/student/${this.state.selectedItems[0]}`)} className="flex justify-between items-center mx-1 cursor-pointer bg-grayish rounded-full md:px-6 px-3 py-1">
                                            {edit("w-6 mx-1 text-white")}
                                            <span className="font-vb mx-1 text-white">ویرایش</span>
                                        </div>
                                        :
                                        null
                                    }
                                </React.Fragment>
                            );
                        }}
                    >
                        {this.renderStudents()}
                    </Table>
                    :
                    <Table
                        headers={['نام', 'نام خانوادگی', 'کد ملی', 'شماره همراه', '']}
                        selected={this.state.confirmItems}
                        checkAll={this.confirmCheckAll}
                        clearItems={this.confirmClearItems}
                        options={() => {
                            return (
                                <React.Fragment>
                                    <div className="flex justify-between mx-1 cursor-pointer items-center bg-red-700 rounded-full md:px-6 px-3 py-1">
                                        {minus("w-6 mx-1 text-white")}
                                        <span className="font-vb mx-1 text-white">رد</span>
                                    </div>
                                    <div className="flex justify-between mx-1 cursor-pointer items-center bg-green rounded-full md:px-6 px-3 py-1">
                                        {verified("w-6 mx-1 text-white")}
                                        <span className="font-vb mx-1 text-white">تایید</span>
                                    </div>
                                </React.Fragment>
                            );
                        }}
                    >
                        {this.renderNewStudents()}
                    </Table>
                }
            </div>
        );
    }

    filterStudent = (student) => {
        if (student.firstName) {
            if (student.firstName.includes(this.state.searchQuery)) return true
        }
        if (student.lastName) {
            if (student.lastName.includes(this.state.searchQuery)) return true
        }
        if (student.melliCode) {
            if (student.melliCode.includes(this.state.searchQuery)) return true
        }
        if (student.phoneNumber) {
            if (student.phoneNumber.includes(this.state.searchQuery)) return true
        }

        return false
    }

    renderStudents = () => {
        return this.props.students.map(student => {
            if (this.filterStudent(student)) {
                return (
                    <tr key={student.id} className={`text-center ${this.state.selectedItems.includes(student.id) ? 'bg-gray-200' : ''} hover:bg-gray-200`}>
                        <td className="py-4">
                            <div className="flex justify-center items-center">
                                <Checkbox checked={this.state.selectedItems.includes(student.id)} itemId={student.id} check={this.checkItem} uncheck={this.uncheckItem} />
                            </div>
                        </td>
                        <td>{student.firstName}</td>
                        <td>{student.lastName}</td>
                        <td>{student.melliCode}</td>
                        <td>{student.phoneNumber}</td>
                    </tr>
                );
            }
        })
    }

    renderNewStudents = () => {
        return this.props.newUsers.map(user => {
            if (this.filterStudent(user)) {
                return (
                    <tr key={user.id} className={`text-center ${this.state.confirmItems.includes(user.id) ? 'bg-gray-200' : ''} hover:bg-gray-200`}>
                        <td className="py-4">
                            <div className="flex justify-center items-center">
                                <Checkbox checked={this.state.confirmItems.includes(user.id)} itemId={user.id} check={this.confirmCheckItem} uncheck={this.confirmUncheckItem} />
                            </div>
                        </td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.melliCode}</td>
                        <td>{user.phoneNumber}</td>
                        <td>
                            <div onClick={() => history.push(`/confirm/${user.id}`)} className="flex justify-center items-center cursor-pointer">
                                {check("w-8 text-grayish transition-all duration-300 hover:text-magneta")}
                            </div>
                        </td>
                    </tr>
                );
            }
        })
    }

    checkItem = (id) => {
        this.setState({ selectedItems: [...this.state.selectedItems, id] })
    }

    confirmCheckItem = (id) => {
        this.setState({ confirmItems: [...this.state.confirmItems, id] })
    }

    uncheckItem = (id) => {
        this.setState({ selectedItems: this.state.selectedItems.filter(el => el !== id)})
    }

    confirmUncheckItem = (id) => {
        this.setState({ confirmItems: this.state.confirmItems.filter(el => el !== id)})
    }

    checkAll = () => {
        this.setState({ selectedItems: this.props.students.map(student => student.id) })
    }

    confirmCheckAll = () => {
        this.setState({ confirmItems: this.props.newUsers.map(user => user.id) })
    }

    clearItems = () => {
        this.setState({ selectedItems: [] })
    }

    confirmClearItems = () => {
        this.setState({ confirmItems: [] })
    }

    render() {
        if (this.state.loading) return <div className="flex justify-center items-center">{loading("w-16 text-grayish")}</div>
        return (
            <div className="w-full">
                <div className="w-full flex xl:flex-row-reverse flex-col justify-start items-center">
                    <SearchBar
                        value={this.state.searchQuery}
                        search={this.search}
                    />
                    <button onClick={() => history.push('/addStudents')} className="py-1 px-8 xl:my-0 my-4 mx-4 bg-magneta rounded-full text-white focus:outline-none focus:shadow-outline">دانش آموزان جدید</button>
                </div>

                {this.renderContent()}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return { user: state.auth.userInfo, students: state.managerData.students, newUsers: state.managerData.newUsers }
}

const authWrapped = protectedManager(Students)
export default connect(mapStateToProps, { getAllStudents, confirmUser })(authWrapped);