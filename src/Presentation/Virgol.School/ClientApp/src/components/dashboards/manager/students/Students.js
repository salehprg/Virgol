import React from "react";
import { withTranslation } from 'react-i18next';
import PlusTable from "../../tables/PlusTable";
import {edit, loading, trash , check_circle} from "../../../../assets/icons";
import history from "../../../../history";
import { connect } from "react-redux";
import {getAllStudents , addBulkUser , DeleteStudents} from "../../../../_actions/managerActions"
import DeleteConfirm from "../../../modals/DeleteConfirm";
import MonsterTable from "../../tables/MonsterTable";
import Checkbox from "../../tables/Checkbox";
import { fullNameSerach, pagingItems } from "../../../Search/Seaarch";

class Students extends React.Component {

    state = {
        loading: false,
        query: '' ,
        showDeleteModal : false ,
        studentId : 0,
        selected : [],
        itemsPerPage: 40,
        currentPage: 1,
        totalCard : 0
    }

    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.getAllStudents(this.props.user.token);
        this.setState({ loading: false })
        
        this.queriedStudents('')
    }

    checkAll = () => {
        this.setState({ selected: this.props.students.map(teacher => teacher.id) })
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

    handleSelectStudent = (e) =>{
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

    changeQuery = query => {
        this.setState({ query })
        this.queriedStudents(query)
    }

    queriedStudents = (query , currentPage = -1) => {
        const serachedItems = fullNameSerach(this.props.students , query , (currentPage != -1 ? currentPage : this.state.currentPage)  , this.state.itemsPerPage)
        const pagedItems = pagingItems(serachedItems , (currentPage != -1 ? currentPage : this.state.currentPage)  , this.state.itemsPerPage)

        this.setState({students :  pagedItems})
        this.setState({totalCard : serachedItems.length})
    }

    

    showDelete = (id) => {
        this.setState({showDeleteModal : true , studentId : id})
    }

    deleteStudent = async () => {
        const data = this.state.selected

        await this.props.DeleteStudents(this.props.user.token , data)
        this.setState({showDeleteModal : false , selected : []})
    }

    submitExcel = async (excel) => {
        await this.props.addBulkUser(this.props.user.token , excel)
    }

    paginate = (num) => {
        this.setState({ currentPage: num })
        this.queriedStudents(this.state.query , num)
    }

    render() {
        if(this.state.loading) loading('w-10 text-grayish centerize')
        return (
            <div className="w-full mt-10">
                {this.state.showDeleteModal ? 
                <DeleteConfirm
                    title={this.props.t('deleteConfirm')}
                    confirm={this.deleteStudent}
                    cancel={() => this.setState({ showDeleteModal: false, teacherId: null })}
                /> 
                : 
                null
                }
                <MonsterTable
                    title={this.props.t('studentsList')}
                    isLoading={this.state.loading}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    cardsPerPage={this.state.itemsPerPage}
                    totalCards={this.state.totalCard}
                    paginate={this.paginate}
                    currentPage={this.state.currentPage}
                    button={() => {
                        return (
                            <button onClick={() => history.push('/newStudent')} className="px-6 py-1 ml-4 lg:mb-0 mb-2 border-2 border-sky-blue text-sky-blue rounded-lg">{this.props.t('addStudent')}</button>
                        );
                    }}
                    sample={this.props.t('downloadStudentsExcelSample')}
                    sampleLink="/samples/StudentTemplate.xlsx"
                    excel={this.props.t('uploadStudentsExcel')}
                    handleExcel={this.submitExcel}
                    // headers={[ '' ,'نام', 'نام خانوادگی', 'تلفن همراه', 'کد ملی', 'نام ولی' , 'تلفن ولی' , 'حساب تکمیل شده', '' ]}
                    headers={['نام', 'نام خانوادگی', 'تلفن همراه', 'کد ملی', 'نام ولی', 'تلفن ولی', 'حساب تکمیل شده', '']}
                    headers={[this.props.t('firstName'), this.props.t('lastName'), this.props.t('phoneNumber'), this.props.t('nationCode'), this.props.t('fatherName'), this.props.t('fatherPhoneNumber'),this.props.t('completedAccount'), '']}
                    body={() => {

                        return (
                            <React.Fragment>
                                {(this.state.students ?
                                    this.state.students.map(x => {
                                        return(
                                        <tr>
                                            {/*<td><input type="checkbox" value={x.id} onChange={this.handleSelectStudent}></input></td>*/}
                                            <td className="py-4">
                                                <div className="flex justify-center items-center">
                                                    <Checkbox checked={this.state.selected.includes(x.id)} itemId={x.id} check={this.checkItem} uncheck={this.uncheckItem} />
                                                </div>
                                            </td>
                                            <td className="py-4">{x.firstName}</td>
                                            <td>{x.lastName}</td>
                                            <td>{x.phoneNumber}</td>
                                            <td>{x.melliCode}</td>
                                            <td>{x.fatherName}</td>
                                            <td>{x.fatherPhoneNumber}</td>
                                            <td><span className="text-center">{x.latinFirstname && x.latinLastname ? check_circle('w-8 text-greenish') : null}</span></td>
                                            <td className="cursor-pointer" onClick={() => history.push(`/student/${x.id}`)}>
                                                {edit('w-6 text-white')}
                                            </td>            
                                            {/*<td onClick={() => this.showDelete(x.id)} className="cursor-pointer">*/}
                                            {/*    {trash('w-6 text-white ')}*/}
                                            {/*</td>*/}
                                        </tr>
                                        )
                                    })
                                    : this.props.t('loading')
                                )}
                            </React.Fragment>
                        );
                    }}
                    options={() => {
                        return (
                            <React.Fragment>
                                <div onClick={() => this.setState({ showDeleteModal: true })} className="flex justify-between mx-1 cursor-pointer items-center bg-red-700 rounded-full md:px-6 px-3 py-1">
                                    {trash("w-6 mx-1 text-white")}
                                    <span className="font-vb mx-1 text-white">{this.props.t('delete')}</span>
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
    return {user: state.auth.userInfo , students: state.managerData.students}
}

const cwrapped = connect(mapStateToProps, { getAllStudents , addBulkUser , DeleteStudents })(Students);

export default withTranslation()(cwrapped);