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
import { querySearch , pagingItems } from "../../../Search/Seaarch";

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
        this.queriedSchools(this.state.query , num)
    }

    queriedSchools = (query , currentPage = -1) => {
        var serachedItems = []

        serachedItems = this.props.schools.filter(x => (x.schoolName.includes(query) || x.firstName.includes(query) || x.lastName.includes(query) || x.schoolIdNumber.includes(query) || x.schoolTypeName.includes(query)))

        const pagedItems = pagingItems(serachedItems ,  (currentPage != -1 ? currentPage : this.state.currentPage) , this.state.itemsPerPage)

        this.setState({schools :  pagedItems})
        this.setState({totalCard : serachedItems.length})
    }

    render() {
        if(this.state.loading) return loading('tw-w-10 tw-text-grayish centerize')
        return (
            <div className="tw-w-full tw-mt-10">
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
                        <button onClick={() => history.push('/newSchool')} className="tw-px-6 tw-py-1 tw-ml-4 tw-mb-4 tw-border-2 tw-border-sky-blue tw-text-sky-blue tw-rounded-lg">{this.props.t('addSchool')}</button>
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
                                                <td className="tw-py-4 tw-text-right tw-px-4">{x.schoolName}</td>
                                                <td className="tw-text-right tw-px-4 tw-py-4">{x.schoolIdNumber}</td>
                                                <td className="tw-text-right tw-px-4 tw-py-4">{x.schoolTypeName}</td>
                                                <td className="tw-text-right tw-px-2 tw-py-4">{x.firstName} {x.lastName}</td>
                                                <td data-tip={this.props.t('enterAsManager')} onClick={() => this.redirect(x.id)} className="tw-cursor-pointer tw-py-4 tw-px-2">
                                                    {external_link('tw-w-6 tw-text-white ')}
                                                    <ReactTooltip type="dark" effect="float" place="top"/>
                                                </td>
                                                
                                                <td className="tw-text-right tw-px-4 tw-py-4" data-tip={this.props.t('edit')} className="tw-cursor-pointer" onClick={() => history.push(`/school/${x.id}`)}>
                                                    {edit('tw-w-6 tw-text-white')}
                                                </td>
                                                <td className="tw-text-right tw-px-4 tw-py-4" data-tip={this.props.t('delete')} onClick={() => this.showDelete(x.id)} className="tw-cursor-pointer">
                                                    {trash('tw-w-6 tw-text-white ')}
                                                </td>
                                                <ReactTooltip place="top" effect="float" type="dark"/>
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