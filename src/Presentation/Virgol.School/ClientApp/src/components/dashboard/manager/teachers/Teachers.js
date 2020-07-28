import React from 'react';
import { connect } from 'react-redux';
import { getAllTeachers, deleteTeacher } from "../../../../_actions/managerActions";
import SearchBar from "../../SearchBar";
import {edit, loading, remove} from "../../../../assets/icons";
import protectedManager from "../../../protectedRoutes/protectedManager";
import AddTeacherModal from "./AddTeacherModal";
import Table from "../../table/Table";
import Checkbox from "../../table/Checkbox";
import history from "../../../../history";
import ConfirmDelete from "../../../modal/ConfirmDelete";

class Teachers extends React.Component {

    state = { loading: false, showAddTeacher: false, showDeleteTeachers: false, searchQuery: '', selectedItems: [] }

    async componentDidMount() {
        if (this.props.history.action === 'POP' || !this.props.teachers) {
            this.setState({loading: true})
            await this.props.getAllTeachers(this.props.user.token);
            this.setState({loading: false})
        }
    }

    search = (query) => {
        this.setState({ searchQuery: query })
    }

    renderContent = () => {
        if (!this.props.teachers) return null;
        if (this.props.teachers.length === 0) return (
            <span className="text-2xl text-grayish block text-center">هیچ مقطعی وجود ندارد</span>
        );
        return (
            <div className="w-full mt-12">
                <Table
                    headers={['نام', 'نام خانوادگی', 'کد ملی', 'شماره همراه', 'تاریخ ایجاد', 'آخرین ویرایش']}
                    selected={this.state.selectedItems}
                    checkAll={this.checkAll}
                    clearItems={this.clearItems}
                    edit={(id) => history.push(`/teacher/${id}`)}
                    options={() => {
                        return (
                            <React.Fragment>
                                <div onClick={() => this.setState({ showDeleteTeachers: true })} className="flex justify-between mx-1 cursor-pointer items-center bg-red-700 rounded-full md:px-6 px-3 py-1">
                                    {remove("w-6 mx-1 text-white")}
                                    <span className="font-vb mx-1 text-white">حذف</span>
                                </div>
                                {this.state.selectedItems.length === 1 ?
                                    <div onClick={() => history.push(`/teacher/${this.state.selectedItems[0]}`)} className="flex justify-between items-center mx-1 cursor-pointer bg-grayish rounded-full md:px-6 px-3 py-1">
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
                    {this.renderTeachers()}
                </Table>
            </div>
        );
    }

    filterTeacher = (teacher) => {
        if (teacher.firstName) {
            if (teacher.firstName.includes(this.state.searchQuery)) return true
        }
        if (teacher.lastName) {
            if (teacher.lastName.includes(this.state.searchQuery)) return true
        }
        if (teacher.melliCode) {
            if (teacher.melliCode.includes(this.state.searchQuery)) return true
        }
        if (teacher.phoneNumber) {
            if (teacher.phoneNumber.includes(this.state.searchQuery)) return true
        }

        return false
    }

    renderTeachers = () => {
        return this.props.teachers.map(teacher => {
            if (this.filterTeacher(teacher)) {
                return (
                    <tr key={teacher.id} className="text-center">
                        <td className="py-4">
                            <div className="flex justify-center items-center">
                                <Checkbox checked={this.state.selectedItems.includes(teacher.id)} itemId={teacher.id} check={this.checkItem} uncheck={this.uncheckItem} />
                            </div>
                        </td>
                        <td>{teacher.firstName}</td>
                        <td>{teacher.lastName}</td>
                        <td>{teacher.melliCode}</td>
                        <td>{teacher.phoneNumber}</td>
                        <td>1399/5/5</td>
                        <td>1399/4/6</td>
                    </tr>
                );
            }
        })
    }

    checkItem = (id) => {
        this.setState({ selectedItems: [...this.state.selectedItems, id] })
    }

    uncheckItem = (id) => {
        this.setState({ selectedItems: this.state.selectedItems.filter(el => el !== id)})
    }

    checkAll = () => {
        this.setState({ selectedItems: this.props.teachers.map(teacher => teacher.id) })
    }

    clearItems = () => {
        this.setState({ selectedItems: [] })
    }

    cancelAdd = () => {
        this.setState({ showAddTeacher: false })
    }

    deleteTeachers = () => {
        this.setState({showDeleteTeachers: false, selectedItems: [] })
        this.props.deleteTeacher(this.props.user.token, this.state.selectedItems)
    }

    render() {
        if (this.state.loading) return <div className="flex justify-center items-center">{loading("w-16 text-grayish")}</div>
        return (
            <div className="w-full">
                {this.state.showAddTeacher ? <AddTeacherModal onAddCancel={this.cancelAdd} /> : null}
                {this.state.showDeleteTeachers ? <ConfirmDelete onConfirm={this.deleteTeachers} onCancel={() => this.setState({ showDeleteTeachers: false })} text="آیا از حذف اطمینان دارید؟" /> : null}
                <div className="w-full flex xl:flex-row-reverse flex-col justify-start items-center">
                    <SearchBar
                        value={this.state.searchQuery}
                        search={this.search}
                    />
                    <button onClick={() => this.setState({ showAddTeacher: true })} className="py-1 px-8 xl:my-0 my-4 mx-4 bg-purple rounded-full text-white focus:outline-none focus:shadow-outline">معلم جدید</button>
                </div>

                {this.renderContent()}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return { user: state.auth.userInfo, teachers: state.managerData.teachers }
}

const authWrapped = protectedManager(Teachers)
export default connect(mapStateToProps, { getAllTeachers, deleteTeacher })(authWrapped);