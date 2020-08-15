import React from "react";
import PlusTable from "../../tables/PlusTable";
import {edit, loading, trash , check_circle} from "../../../../assets/icons";
import history from "../../../../history";
import { connect } from "react-redux";
import {getAllStudents , addBulkUser , DeleteStudents} from "../../../../_actions/managerActions"
import DeleteConfirm from "../../../modals/DeleteConfirm";

class Students extends React.Component {

    state = { loading: false, query: '' , showDeleteModal : false , studentId : 0}

    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.getAllStudents(this.props.user.token);
        this.setState({ loading: false })
    }

    changeQuery = query => {
        this.setState({ query })
    }

    showDelete = (id) => {
        this.setState({showDeleteModal : true , studentId : id})
    }

    deleteStudent = async () => {
        const data = [this.state.studentId]

        await this.props.DeleteStudents(this.props.user.token , data)
        this.setState({showDeleteModal : false , studentId : 0})
    }

    submitExcel = async (excel) => {
        await this.props.addBulkUser(this.props.user.token , excel)
    }

    render() {
        if(this.state.loading) loading('w-10 text-grayish centerize')
        return (
            <div className="w-full mt-10">
                {this.state.showDeleteModal ? 
                <DeleteConfirm
                    title="آیا از عمل حذف مطمئن هستید؟ این عمل قابلیت بازگشت ندارد!"
                    confirm={this.deleteStudent}
                    cancel={() => this.setState({ showDeleteModal: false, teacherId: null })}
                /> 
                : 
                null
                }
                <PlusTable
                    title="لیست دانش آموزان"
                    isLoading={this.state.loading}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    button={() => {
                        return (
                            <button onClick={() => history.push('/newStudent')} className="px-6 py-1 border-2 border-sky-blue text-sky-blue rounded-lg">دانش آموزان جدید</button>
                        );
                    }}
                    excel="آپلود اکسل دانش آموزان"
                    handleExcel={this.submitExcel}
                    headers={['نام', 'نام خانوادگی', 'شماره همراه', 'کد ملی', 'نام پدر' , 'شماره ولی' , 'حساب تکمیل شده']}
                    body={() => {
                        return (
                            <React.Fragment>
                                {
                                    this.props.students.map(x => {
                                        if(x.firstName.includes(this.state.query))
                                        {
                                            return(
                                            <tr>
                                                <td className="py-4">{x.firstName}</td>
                                                <td>{x.lastName}</td>
                                                <td>{x.phoneNumber}</td>
                                                <td>{x.melliCode}</td>
                                                <td>{(x.userDetail ? x.userDetail.fatherName : "")}</td>
                                                <td>{(x.userDetail ? x.userDetail.fatherPhoneNumber : "")}</td>
                                                <td><span className="text-center">{x.completed ? check_circle('w-8 text-greenish') : null}</span></td>
                                                <td className="cursor-pointer" onClick={() => history.push(`/student/${x.id}`)}>
                                                    {edit('w-6 text-white')}
                                                </td>            
                                                <td onClick={() => this.showDelete(x.id)} className="cursor-pointer">
                                                    {trash('w-6 text-white ')}
                                                </td>
                                            </tr>
                                            )
                                        }
                                    })
                                }
                            </React.Fragment>
                        );
                    }}
                />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , students: state.managerData.students}
}

export default connect(mapStateToProps, { getAllStudents , addBulkUser , DeleteStudents })(Students);