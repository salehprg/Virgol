import React from "react";
import { withTranslation } from 'react-i18next';
import PlusTable from "../../tables/PlusTable";
import {edit, external_link, loading, trash} from "../../../../assets/icons";
import history from "../../../../history";
import {getSchools , RemoveSchool , AddBulkSchool} from "../../../../_actions/schoolActions"
import {RedirectAdmin } from "../../../../_actions/adminActions"
import protectedAdmin from "../../../protectedRoutes/protectedAdmin";
import { connect } from "react-redux";
import DeleteConfirm from "../../../modals/DeleteConfirm";
import ReactTooltip from "react-tooltip";
import { fullNameSerach , pagingItems } from "../../../Search/Seaarch";

class Schools extends React.Component {

    state = { loading: false, query: '' , showDeleteModal : false, itemsPerPage: 20, currentPage: 1 , totalCard : 0}

    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.getSchools(this.props.user.token);
        this.setState({ loading: false })
        
        this.setState({schools :  pagingItems(this.props.schools ,  (this.state.currentPage != -1 ? this.state.currentPage : this.state.currentPage) , this.state.itemsPerPage)})
        this.setState({totalCard : this.props.schools.length})
    }

    showDelete = (id) => {
        this.setState({showDeleteModal : true , schoolId : id})
    }

    redirect = async (schoolId) => {
        await this.props.RedirectAdmin(this.props.user.token , parseInt(schoolId))
    }

    deleteSchool = async () => {
        await this.props.RemoveSchool(this.props.user.token , this.state.schoolId)
        this.setState({showDeleteModal : false , schoolId : 0})
    }

    changeQuery = query => {
        this.setState({ query })
        this.queriedSchools(query)
    }

    submitExcel = async excel => {
        await this.props.AddBulkSchool(this.props.user.token , excel)
    }

    paginate = (num) => {
        this.setState({ currentPage: num })
    }

    queriedSchools = (query , currentPage = -1) => {
        var serachedItems = []

        serachedItems = this.props.schools.filter(x => x.schoolName.includes(query))

        const pagedItems = pagingItems(serachedItems ,  (currentPage != -1 ? currentPage : this.state.currentPage) , this.state.itemsPerPage)

        this.setState({schools :  pagedItems})
        this.setState({totalCard : serachedItems.length})
    }

    render() {
        if(this.state.loading) return loading('w-10 text-grayish centerize')
        return (
            <div className="w-full mt-10">
                <ReactTooltip />
                {this.state.showDeleteModal ? 
                <DeleteConfirm
                    title={this.props.t('deleteConfirm')}
                    confirm={this.deleteSchool}
                    cancel={() => this.setState({ showDeleteModal: false, deleteFieldId: null, deleteCatId: null })}
                /> 
                : 
                null
                }
                <PlusTable
                    title={this.props.t('coveredSchools')}
                    searchable
                    isLoading={this.state.loading}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    excel={this.props.t('uploadSchoolsExcel')}
                    sample={this.props.t('downloadSchoolsExcelSample')}
                    sampleLink="/samples/SchoolTemplate.xlsx"
                    handleExcel={this.submitExcel}
                    cardsPerPage={this.state.itemsPerPage}
                    totalCards={this.state.totalCard}
                    paginate={this.paginate}
                    currentPage={this.state.currentPage}
                    button={() => {
                        return (
                        <button onClick={() => history.push('/newSchool')} className="px-6 py-1 ml-4 lg:mb-0 mb-2 border-2 border-sky-blue text-sky-blue rounded-lg">{this.props.t('addSchool')}</button>
                        );
                    }}
                    headers={[this.props.t('schoolName'), this.props.t('code'), this.props.t('type'), this.props.t('manager'), '', '']}
                    body={() => {
                        return (
                            <React.Fragment>
                                {(this.state.schools ?
                                    this.state.schools.map(x => {
                                            return (
                                            <tr key={x.id}>
                                                <td className="py-4">{x.schoolName}</td>
                                                <td>{x.schoolIdNumber}</td>
                                                <td>{x.schoolTypeName}</td>
                                                <td>{x.firstName} {x.lastName}</td>
                                                <td data-tip={this.props.t('enterAsManager')} onClick={() => this.redirect(x.id)} className="cursor-pointer">
                                                    {external_link('w-6 text-white ')}
                                                </td>
                                                <td data-tip={this.props.t('edit')} className="cursor-pointer" onClick={() => history.push(`/school/${x.id}`)}>
                                                    {edit('w-6 text-white')}
                                                </td>
                                                <td data-tip={this.props.t('delete')} onClick={() => this.showDelete(x.id)} className="cursor-pointer">
                                                    {trash('w-6 text-white ')}
                                                </td>
                                            </tr>
                                            )}
                                        )
                                        : null
                                    )}             
                            </React.Fragment>
                        );
                    }}
                />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , schools: state.schoolData.schools}
}

const cwrapped = connect(mapStateToProps, { getSchools , RemoveSchool , RedirectAdmin , AddBulkSchool })(Schools);

export default withTranslation()(cwrapped);