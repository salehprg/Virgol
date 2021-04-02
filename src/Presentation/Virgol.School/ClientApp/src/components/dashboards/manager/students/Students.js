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
import { querySearch, pagingItems } from "../../../Search/Seaarch";

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

        // console.log(this.props);
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
        const serachedItems = querySearch(this.props.students , query , (currentPage != -1 ? currentPage : this.state.currentPage)  , this.state.itemsPerPage)
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
        if(this.state.loading) loading('tw-w-10 tw-text-grayish centerize')
        return (
            <div className="tw-w-full tw-mt-10">
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
                            <button onClick={() => history.push('/newStudent')} className="tw-px-6 tw-py-1 tw-ml-4 tw-mb-4 tw-border-2 tw-border-sky-blue tw-text-sky-blue tw-rounded-lg">{this.props.t('addStudent')}</button>
                        );
                    }}
                    sample={this.props.t('downloadStudentsExcelSample')}
                    sampleLink="/samples/StudentTemplate.xlsx"
                    excel={this.props.t('uploadStudentsExcel')}
                    handleExcel={this.submitExcel}
                    // headers={[ '' ,'نام', 'نام خانوادگی', 'تلفن همراه', 'کد ملی', 'نام ولی' , 'تلفن ولی' , 'حساب تکمیل شده', '' ]}
                    // headers={['نام', 'نام خانوادگی', 'تلفن همراه', 'کد ملی', 'نام ولی', 'تلفن ولی', 'حساب تکمیل شده', '']}
                    headers={[this.props.t('firstName'), this.props.t('lastName'), this.props.t('phoneNumber'), this.props.t('nationCode'), this.props.t('fatherName'), this.props.t('fatherPhoneNumber'),this.props.t('completedAccount'), this.props.t('confirmedAccount') ,this.props.t('className') , '']}
                    body={() => {

                        return (
                            <React.Fragment>
                                {(this.state.students ?
                                    this.state.students.map(x => {
                                        return(
                                        <tr>
                                            {/*<td><input type="checkbox" value={x.id} onChange={this.handleSelectStudent}></input></td>*/}
                                            <td className="tw-py-4 tw-text-right">
                                                <div className="tw-flex tw-justify-center tw-items-center tw-ml-2">
                                                    <Checkbox checked={this.state.selected.includes(x.id)} itemId={x.id} check={this.checkItem} uncheck={this.uncheckItem} />
                                                </div>
                                            </td>
                                            <td className="tw-py-4 tw-text-right tw-px-4">{x.firstName}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.lastName}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.phoneNumber}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.melliCode}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.fatherName}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.fatherPhoneNumber}</td>
                                            <td><span className="tw-text-center tw-px-4 tw-py-4">{x.latinFirstname && x.latinLastname ? check_circle('tw-w-8 tw-text-greenish') : null}</span></td>
                                            <td><span className="tw-text-center tw-px-4 tw-py-4">{x.confirmedAcc ? check_circle('tw-w-8 tw-text-greenish') : null}</span></td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.classsname}</td>
                                            <td className="tw-cursor-pointer tw-text-right tw-px-4 tw-py-4" onClick={() => history.push(`/student/${x.id}`)}>
                                                {edit('tw-w-6 tw-text-white')}
                                            </td>  
                                                      
                                            {/*<td onClick={() => this.showDelete(x.id)} className="tw-cursor-pointer">*/}
                                            {/*    {trash('tw-w-6 tw-text-white ')}*/}
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
                                <div onClick={() => this.setState({ showDeleteModal: true })} className="tw-flex tw-justify-between tw-mx-1 tw-cursor-pointer tw-items-center tw-bg-red-700 tw-rounded-full md:tw-px-6 tw-px-3 tw-py-1">
                                    {trash("tw-w-6 tw-mx-1 tw-text-white")}
                                    <span className="tw-font-vb tw-mx-1 tw-text-white">{this.props.t('delete')}</span>
                                </div>
                                {/*{this.state.selected.length === 1 ?*/}
                                {/*    <div onClick={() => history.push(`/teacher/${this.state.selectedItems[0]}`)} className="tw-flex tw-justify-between tw-items-center tw-mx-1 tw-cursor-pointer tw-bg-grayish tw-rounded-full md:tw-px-6 tw-px-3 tw-py-1">*/}
                                {/*        {edit("tw-w-6 tw-mx-1 tw-text-white")}*/}
                                {/*        <span className="tw-font-vb tw-mx-1 tw-text-white">ویرایش</span>*/}
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