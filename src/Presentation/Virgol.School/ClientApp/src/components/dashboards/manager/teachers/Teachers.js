import React from "react";
import { withTranslation } from 'react-i18next';
import {edit, loading, trash, check_circle, x} from "../../../../assets/icons";
import history from "../../../../history";
import { connect } from "react-redux";
import {getAllTeachers , addBulkTeacher , deleteTeacher} from "../../../../_actions/managerActions"
import DeleteConfirm from "../../../modals/DeleteConfirm";
import ReactTooltip from "react-tooltip";
import Checkbox from "../../tables/Checkbox";
import MonsterTable from "../../tables/MonsterTable";
import { fullNameSerach , pagingItems } from "../../../Search/Seaarch";

class Teachers extends React.Component {

    state = { loading: false, query: '' , showDeleteModal : false, selected : [],
                itemsPerPage: 40, currentPage: 1 , totalCard : 0}

    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.getAllTeachers(this.props.user.token);
        this.setState({ loading: false })

        this.queriedTeachers('')
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
        this.queriedTeachers(query)
    }

    queriedTeachers = (query , currentPage = -1) => {
        const serachedItems = fullNameSerach(this.props.teachers , query , (currentPage != -1 ? currentPage : this.state.currentPage) , this.state.itemsPerPage)
        const pagedItems = pagingItems(serachedItems , (currentPage != -1 ? currentPage : this.state.currentPage) , this.state.itemsPerPage)

        this.setState({teachers :  pagedItems})
        this.setState({totalCard : serachedItems.length})
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
        this.queriedTeachers(this.state.query , num)
    }

    render() {
        if(this.state.loading) loading('w-10 text-grayish centerize')
        return (
            <div className="w-full mt-10">
                <ReactTooltip />
                {this.state.showDeleteModal ? 
                <DeleteConfirm
                    title={this.props.t('deleteConfirm')}
                    confirm={this.deleteTeacher}
                    cancel={() => this.setState({ showDeleteModal: false, teacherId: null })}
                /> 
                : 
                null
                }
                <MonsterTable
                    title={this.props.t('teachersList')}
                    isLoading={this.state.loading}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    cardsPerPage={this.state.itemsPerPage}
                    totalCards={this.state.totalCard}
                    paginate={this.paginate}
                    currentPage={this.state.currentPage}
                    button={() => {
                        return (
                        <button onClick={() => history.push('/newTeacher')} className="px-6 py-1 ml-4 lg:mb-0 mb-2 border-2 border-sky-blue text-sky-blue rounded-lg">{this.props.t('newTeacher')}</button>
                        );
                    }}
                    sample={this.props.t('downloadTeachersExcelSample')}
                    sampleLink="/samples/teacherSample.xls"
                    excel={this.props.t('uploadTeachersExcel')}
                    handleExcel={this.submitExcel}
                    headers={[this.props.t('firstName'), this.props.t('lastName'), this.props.t('nationCode'), this.props.t('phoneNumber'), this.props.t('personelCode'), this.props.t('completedAccount'), '']}
                    body={() => {
                        return (
                            <React.Fragment>
                                {(this.state.teachers ?
                                    this.state.teachers.map(x => {
                                        return(
                                        <tr>
                                            {/*<td><input type="checkbox" value={x.id} onChange={this.handleSelectTeacher}></input></td>*/}
                                            <td className="py-4 text-right">
                                                <div className="flex justify-center items-center">
                                                    <Checkbox checked={this.state.selected.includes(x.id)} itemId={x.id} check={this.checkItem} uncheck={this.uncheckItem} />
                                                </div>
                                            </td>
                                            <td className="py-4 text-right">{x.firstName}</td>
                                            <td className="text-right">{x.lastName}</td>
                                            <td className="text-right">{x.melliCode}</td>
                                            <td className="text-right">{x.phoneNumber}</td>
                                            <td className="text-right">{x.personalIdNUmber}</td>
                                            <td className="text-right"><span className="text-center">{x.latinFirstname && x.latinLastname ? check_circle('w-8 text-greenish') : null}</span></td>
                                            <td className="text-right" data-tip={this.props.t('edit')} className="cursor-pointer" onClick={() => history.push(`/teacher/${x.id}`)}>
                                                {edit('w-6 text-white')}
                                            </td>           
                                            {/*<td data-tip="حذف" onClick={() => this.showDelete(x.id)} className="cursor-pointer">*/}
                                            {/*    {trash('w-6 text-white ')}*/}
                                            {/*</td> */}
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
    return {user: state.auth.userInfo , teachers: state.managerData.teachers}
}
const cwrapped = connect(mapStateToProps, { getAllTeachers , addBulkTeacher , deleteTeacher })(Teachers);

export default withTranslation()(cwrapped);