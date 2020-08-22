import React from "react";
import {edit, loading, trash, check_circle, x} from "../../../../assets/icons";
import history from "../../../../history";
import { connect } from "react-redux";
import {getAllTeachers , addBulkTeacher , deleteTeacher} from "../../../../_actions/managerActions"
import DeleteConfirm from "../../../modals/DeleteConfirm";
import ReactTooltip from "react-tooltip";
import Checkbox from "../../tables/Checkbox";
import MonsterTable from "../../tables/MonsterTable";

class Teachers extends React.Component {

    state = { loading: false, query: '' , showDeleteModal : false, selected : [],
                itemsPerPage: 40, currentPage: 1 , totalCard : 0}

    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.getAllTeachers(this.props.user.token);
        this.setState({ loading: false })

        this.setState({totalCard : this.props.teachers.length})
    }

    checkAll = () => {
        this.setState({ selected: this.props.teachers.map(teacher => teacher.id) })
    }

    clearItems = () => {
        this.setState({ selected: [] })
    }

    checkItem = (id) => {
        this.setState({ selected: [...this.state.selected, id] })
    }

    uncheckItem = (id) => {
        this.setState({ selected: this.state.selected.filter(el => el !== id)})
    }

    changeQuery = query => {
        this.setState({ query })
    }

    showDelete = (id) => {
        this.setState({showDeleteModal : true , teacherId : id})
    }

    deleteTeacher = async () => {
        await this.props.deleteTeacher(this.props.user.token , this.state.selected)
        this.setState({showDeleteModal : false , teacherId : 0})
    }

    handleSelectTeacher = (e) =>{
        const event = e;

        if(event.target.checked)
        {
            this.setState({selected : [...this.state.selected, parseInt(event.target.value)]})
        }
        else
        {
            this.setState({selected : this.state.selected.filter(element => element !== parseInt(event.target.value))})
        } 
    }

    submitExcel = async (excel) => {
        await this.props.addBulkTeacher(this.props.user.token , excel)
    }

    paginate = (num) => {
        this.setState({ currentPage: num })
    }

    render() {
        if(this.state.loading) loading('w-10 text-grayish centerize')
        return (
            <div className="w-full mt-10">
                <ReactTooltip />
                {this.state.showDeleteModal ? 
                <DeleteConfirm
                    title="آیا از عمل حذف مطمئن هستید؟ این عمل قابلیت بازگشت ندارد!"
                    confirm={this.deleteTeacher}
                    cancel={() => this.setState({ showDeleteModal: false, teacherId: null })}
                /> 
                : 
                null
                }
                <MonsterTable
                    title="لیست معلمان"
                    isLoading={this.state.loading}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    cardsPerPage={this.state.itemsPerPage}
                    totalCards={this.state.totalCard}
                    paginate={this.paginate}
                    currentPage={this.state.currentPage}
                    button={() => {
                        return (
                            <button onClick={() => history.push('/newTeacher')} className="px-6 py-1 ml-4 lg:mb-0 mb-2 border-2 border-sky-blue text-sky-blue rounded-lg">معلم جدید</button>
                        );
                    }}
                    sample="بارگیری نمونه اکسل معلمان"
                    sampleLink="/samples/teacherSample.xls"
                    excel="بارگذاری اکسل معلمان"
                    handleExcel={this.submitExcel}
                    headers={['نام', 'نام خانوادگی', 'کد ملی', 'تلفن تماس', 'کد پرسنلی', 'حساب تکمیل شده', '']}
                    body={() => {
                        return (
                            <React.Fragment>
                                {
                                    this.props.teachers.slice((this.state.currentPage - 1) * this.state.itemsPerPage , this.state.currentPage  * this.state.itemsPerPage).map(x => {
                                        if (x.firstName.includes(this.state.query) || x.lastName.includes(this.state.query) || (x.firstName + " " + x.lastName).includes(this.state.query))
                                        {
                                            return(
                                            <tr>
                                                {/*<td><input type="checkbox" value={x.id} onChange={this.handleSelectTeacher}></input></td>*/}
                                                <td className="py-4">
                                                    <div className="flex justify-center items-center">
                                                        <Checkbox checked={this.state.selected.includes(x.id)} itemId={x.id} check={this.checkItem} uncheck={this.uncheckItem} />
                                                    </div>
                                                </td>
                                                <td className="py-4">{x.firstName}</td>
                                                <td>{x.lastName}</td>
                                                <td>{x.melliCode}</td>
                                                <td>{x.phoneNumber}</td>
                                                <td>{x.personalIdNUmber}</td>
                                                <td><span className="text-center">{x.latinFirstname && x.latinLastname ? check_circle('w-8 text-greenish') : null}</span></td>
                                                <td data-tip="ویرایش" className="cursor-pointer" onClick={() => history.push(`/teacher/${x.id}`)}>
                                                    {edit('w-6 text-white')}
                                                </td>           
                                                {/*<td data-tip="حذف" onClick={() => this.showDelete(x.id)} className="cursor-pointer">*/}
                                                {/*    {trash('w-6 text-white ')}*/}
                                                {/*</td> */}
                                            </tr>
                                            )
                                        }
                                    })
                                }
                            </React.Fragment>
                        );
                    }}
                    options={() => {
                        return (
                            <React.Fragment>
                                <div onClick={() => this.setState({ showDeleteModal: true })} className="flex justify-between mx-1 cursor-pointer items-center bg-red-700 rounded-full md:px-6 px-3 py-1">
                                    {trash("w-6 mx-1 text-white")}
                                    <span className="font-vb mx-1 text-white">حذف</span>
                                </div>
                                {/*{this.state.selected.length === 1 ?*/}
                                {/*    <div onClick={() => history.push(`/teacher/${this.state.selectedItems[0]}`)} className="flex justify-between items-center mx-1 cursor-pointer bg-grayish rounded-full md:px-6 px-3 py-1">*/}
                                {/*        {edit("w-6 mx-1 text-white")}*/}
                                {/*        <span className="font-vb mx-1 text-white">ویرایش</span>*/}
                                {/*    </div>*/}
                                {/*    :*/}
                                {/*    null*/}
                                {/*}*/}
                            </React.Fragment>
                        );
                    }}
                    selected={this.state.selected}
                    checkAll={this.checkAll}
                    clearItems={this.clearItems}
                />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , teachers: state.managerData.teachers}
}

export default connect(mapStateToProps, { getAllTeachers , addBulkTeacher , deleteTeacher })(Teachers);