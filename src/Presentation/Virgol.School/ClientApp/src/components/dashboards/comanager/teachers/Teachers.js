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
import PlusTable from "../../tables/PlusTable";

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

    paginate = (num) => {
        this.setState({ currentPage: num })
        this.queriedTeachers(this.state.query , num)
    }

    render() {
        if(this.state.loading) loading('tw-w-10 tw-text-grayish centerize')
        return (
            <div className="tw-w-full tw-mt-10">
                <ReactTooltip />
                <PlusTable 
                    title={this.props.t('teachersList')}
                    isLoading={this.state.loading}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    cardsPerPage={this.state.itemsPerPage}
                    totalCards={this.state.totalCard}
                    paginate={this.paginate}
                    currentPage={this.state.currentPage}
                    button={() => null}
                    headers={[this.props.t('firstName'), this.props.t('lastName'), this.props.t('nationCode'), this.props.t('phoneNumber'), this.props.t('personelCode'), this.props.t('completedAccount'), this.props.t('confirmedAccount')]}
                    body={() => {
                        return (
                            <React.Fragment>
                                {(this.state.teachers ?
                                    this.state.teachers.map(x => {
                                        return(
                                        <tr>
                                            {/*<td><input type="checkbox" value={x.id} onChange={this.handleSelectTeacher}></input></td>*/}
                                            <td className="tw-py-4 tw-text-right tw-px-4">{x.firstName}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.lastName}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.melliCode}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.phoneNumber}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.personalIdNUmber}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4"><span className="tw-text-center">{x.latinFirstname && x.latinLastname ? check_circle('tw-w-8 tw-text-greenish') : null}</span></td>
                                            <td className="tw-text-right tw-px-4 tw-py-4"><span className="tw-text-center">{x.confirmedAcc ? check_circle('tw-w-8 tw-text-greenish') : null}</span></td>          
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