import React from 'react';
import { connect } from 'react-redux';
import { getAllStudents } from "../../../../_actions/managerActions";
import SearchBar from "../../SearchBar";
import {loading} from "../../../../assets/icons";
import protectedManager from "../../../protectedRoutes/protectedManager";
import Table from "../../table/Table";
import Checkbox from "../../table/Checkbox";
import history from "../../../../history";

class Students extends React.Component {

    state = { loading: false, searchQuery: '', selectedItems: [] }

    async componentDidMount() {
        if (this.props.history.action === 'POP') {
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
            <div className="w-full mt-12">
                <Table
                    headers={['نام', 'نام خانوادگی', 'کد ملی', 'شماره همراه', 'تاریخ ایجاد', 'آخرین ویرایش']}
                    selected={this.state.selectedItems}
                    checkAll={this.checkAll}
                    clearItems={this.clearItems}
                >
                    {this.renderStudents()}
                </Table>
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
                    <tr key={student.id} className="text-center">
                        <td className="py-4">
                            <div className="flex justify-center items-center">
                                <Checkbox checked={this.state.selectedItems.includes(student.id)} itemId={student.id} check={this.checkItem} uncheck={this.uncheckItem} />
                            </div>
                        </td>
                        <td>{student.firstName}</td>
                        <td>{student.lastName}</td>
                        <td>{student.melliCode}</td>
                        <td>{student.phoneNumber}</td>
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
        this.setState({ selectedItems: this.props.students.map(student => student.id) })
    }

    clearItems = () => {
        this.setState({ selectedItems: [] })
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
    return { user: state.auth.userInfo, students: state.managerData.students }
}

const authWrapped = protectedManager(Students)
export default connect(mapStateToProps, { getAllStudents })(authWrapped);