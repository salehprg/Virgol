import React from "react";
import PlusTable from "../../tables/PlusTable";
import {edit, loading, trash , check_circle} from "../../../../assets/icons";
import history from "../../../../history";
import { connect } from "react-redux";
import {getAllTeachers , addBulkTeacher , deleteTeacher} from "../../../../_actions/managerActions"
import DeleteConfirm from "../../../modals/DeleteConfirm";

class Teachers extends React.Component {

    state = { loading: false, query: '' , showDeleteModal : false}

    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.getAllTeachers(this.props.user.token);
        this.setState({ loading: false })
    }

    changeQuery = query => {
        this.setState({ query })
    }

    showDelete = (id) => {
        this.setState({showDeleteModal : true , teacherId : id})
    }

    deleteTeacher = async () => {
        await this.props.deleteTeacher(this.props.user.token , [this.state.teacherId])
        this.setState({showDeleteModal : false , teacherId : 0})
    }


    submitExcel = async (excel) => {
        await this.props.addBulkTeacher(this.props.user.token , excel)
    }

    render() {
        if(this.state.loading) loading('w-10 text-grayish centerize')
        return (
            <div className="w-full mt-10">
                {this.state.showDeleteModal ? 
                <DeleteConfirm
                    title="آیا از عمل حذف مطمئن هستید؟ این عمل قابلیت بازگشت ندارد!"
                    confirm={this.deleteTeacher}
                    cancel={() => this.setState({ showDeleteModal: false, teacherId: null })}
                /> 
                : 
                null
                }
                <PlusTable
                    title="لیست معلمان"
                    isLoading={this.state.loading}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    button={() => {
                        return (
                            <button onClick={() => history.push('/newTeacher')} className="px-6 py-1 border-2 border-sky-blue text-sky-blue rounded-lg">معلم جدید</button>
                        );
                    }}
                    sample="دانلود نمونه اکسل معلمان"
                    sampleLink="/samples/teacherSample.xlsx"
                    excel="بارگذاری اکسل معلمان"
                    handleExcel={this.submitExcel}
                    headers={['نام', 'نام خانوادگی', 'کد ملی', 'تلفن تماس' , 'کد پرسنلی' , 'حساب تکمیل شده']}
                    body={() => {
                        return (
                            <React.Fragment>
                                {
                                    this.props.teachers.map(x => {
                                        if (x.firstName.includes(this.state.query) || x.lastName.includes(this.state.query) || (x.firstName + " " + x.lastName).includes(this.state.query))
                                        {
                                            return(
                                            <tr>
                                                <td className="py-4">{x.firstName}</td>
                                                <td>{x.lastName}</td>
                                                <td>{x.melliCode}</td>
                                                <td>{x.phoneNumber}</td>
                                                <td>{x.teacherDetail.personalIdNUmber}</td>
                                                <td><span className="text-center">{x.completed ? check_circle('w-8 text-greenish') : null}</span></td>
                                            
                                                <td className="cursor-pointer" onClick={() => history.push(`/teacher/${x.id}`)}>
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
    return {user: state.auth.userInfo , teachers: state.managerData.teachers}
}

export default connect(mapStateToProps, { getAllTeachers , addBulkTeacher , deleteTeacher })(Teachers);