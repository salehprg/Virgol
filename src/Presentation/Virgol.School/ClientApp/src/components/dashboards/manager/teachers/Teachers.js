import React from "react";
import { withTranslation } from 'react-i18next';
import {edit, loading, trash, check_circle} from "../../../../assets/icons";
import history from "../../../../history";
import { connect } from "react-redux";
import {getAllTeachers , addBulkTeacher , deleteTeacher} from "../../../../_actions/managerActions"
import DeleteConfirm from "../../../modals/DeleteConfirm";
import ReactTooltip from "react-tooltip";
import Checkbox from "../../tables/Checkbox";
import MonsterTable from "../../tables/MonsterTable";
import { querySearch , pagingItems } from "../../../Search/Seaarch";

class Teachers extends React.Component {

    state = { loading: false, query: '' , showDeleteModal : false, selected : [],
                itemsPerPage: 40, currentPage: 1 , totalCard : 0}

    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.getAllTeachers(this.props.user.token);
        this.setState({ loading: false })

        this.queriedTeachers('')

        // console.log(this.props);
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
        const serachedItems = querySearch(this.props.teachers , query , (currentPage != -1 ? currentPage : this.state.currentPage) , this.state.itemsPerPage)
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
        if(this.state.loading) loading('tw-w-10 tw-text-grayish centerize')
        return (
            <div className="tw-w-full tw-mt-10">
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
                        <button onClick={() => history.push('/newTeacher')} className="tw-px-6 tw-py-1 tw-ml-4 tw-mb-4 tw-border-2 tw-border-sky-blue tw-text-sky-blue tw-rounded-lg">{this.props.t('newTeacher')}</button>
                        );
                    }}
                    sample={this.props.t('downloadTeachersExcelSample')}
                    sampleLink="/samples/teacherSample.xls"
                    excel={this.props.t('uploadTeachersExcel')}
                    handleExcel={this.submitExcel}
                    headers={[this.props.t('firstName'), this.props.t('lastName'), this.props.t('nationCode'), this.props.t('phoneNumber'), this.props.t('personelCode'), this.props.t('completedAccount'), this.props.t('confirmedAccount'), '']}
                    body={() => {
                        return (
                            <React.Fragment>
                                {(this.state.teachers ?
                                    this.state.teachers.map(x => {
                                        return(
                                        <tr>
                                            {/*<td><input type="checkbox" value={x.id} onChange={this.handleSelectTeacher}></input></td>*/}
                                            <td className="tw-py-4 tw-text-right">
                                                <div className="tw-flex tw-justify-center tw-items-center">
                                                    <Checkbox checked={this.state.selected.includes(x.id)} itemId={x.id} check={this.checkItem} uncheck={this.uncheckItem} />
                                                </div>
                                            </td>
                                            <td className="tw-py-4 tw-text-right tw-px-4">{x.firstName}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.lastName}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.melliCode}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.phoneNumber}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.personalIdNUmber}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4"><span className="tw-text-center">{x.latinFirstname && x.latinLastname ? check_circle('tw-w-8 tw-text-greenish') : null}</span></td>
                                            <td className="tw-text-right tw-px-4 tw-py-4"><span className="tw-text-center">{x.confirmedAcc ? check_circle('tw-w-8 tw-text-greenish') : null}</span></td>
                                            <td className="tw-text-right tw-px-4 tw-py-4" data-tip={this.props.t('edit')} className="tw-cursor-pointer" onClick={() => history.push(`/teacher/${x.id}`)}>
                                                {edit('tw-w-6 tw-text-white')}
                                            </td>           
                                            {/*<td data-tip="حذف" onClick={() => this.showDelete(x.id)} className="tw-cursor-pointer">*/}
                                            {/*    {trash('tw-w-6 tw-text-white ')}*/}
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
    return {user: state.auth.userInfo , teachers: state.managerData.teachers}
}
const cwrapped = connect(mapStateToProps, { getAllTeachers , addBulkTeacher , deleteTeacher })(Teachers);

export default withTranslation()(cwrapped);