import React from "react";
import { withTranslation } from 'react-i18next';
import PlusTable from "../../tables/PlusTable";
import {edit, loading,check_circle, trash} from "../../../../assets/icons";
import history from "../../../../history";
import { connect } from "react-redux";
import {GetAllStudents} from "../../../../_actions/adminActions"
import { querySearch , pagingItems } from "../../../Search/Seaarch";


class adminStudents extends React.Component {

    state = { loading: false, query: '' , showDeleteModal : false, itemsPerPage: 40, currentPage: 1 , totalCard : 0}

    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.GetAllStudents(this.props.user.token);
        this.setState({ loading: false })
        
        this.queriedStudent('');

    }

    changeQuery = query => {
        this.setState({ query })
        this.queriedStudent(query)
    }

    queriedStudent = (query , currentPage = -1) => {
        const serachedItems = querySearch(this.props.allStudents , query , (currentPage != -1 ? currentPage : this.state.currentPage) , this.state.itemsPerPage)
        const pagedItems = pagingItems(serachedItems , (currentPage != -1 ? currentPage : this.state.currentPage) , this.state.itemsPerPage)

        this.setState({students :  pagedItems})
        this.setState({totalCard : serachedItems.length})
    }

    paginate = (num) => {
        this.setState({ currentPage: num })
        this.queriedStudent(this.state.query , num)
    }

    render() {
        if(this.state.loading || !this.props.allStudents) loading('tw-w-10 tw-text-grayish centerize')
        return (
            <div className="tw-w-full tw-mt-10">
                <PlusTable
                    title={this.props.t('studentsList')}
                    isLoading={this.state.loading}
                    button={() => {}}
                    searchable
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    headers={[this.props.t('firstName'), this.props.t('lastName'), this.props.t('schoolName'), this.props.t('nationCode'), this.props.t('phoneNumber'), this.props.t('fatherPhoneNumber'), this.props.t('completedAccount') , this.props.t('confirmedAccount')]}
                    cardsPerPage={this.state.itemsPerPage}
                    totalCards={this.state.totalCard}
                    paginate={this.paginate}
                    currentPage={this.state.currentPage}
                    body={() => {

                        return (
                            <React.Fragment>
                                {(this.state.students ?
                                    this.state.students.map(x => {
                                        return(
                                        <tr>
                                            <td className="tw-py-4 tw-text-right tw-px-4">{x.firstName}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.lastName}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.schoolName}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.melliCode}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.phoneNumber}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.fatherPhoneNumber}</td>
                                            <td><span className="tw-text-center tw-px-4 tw-py-4">{x.latinFirstname && x.latinLastname ? check_circle('tw-w-8 tw-text-greenish') : null}</span></td>
                                            <td><span className="tw-text-center tw-px-4 tw-py-4">{x.confirmedAcc ? check_circle('tw-w-8 tw-text-greenish') : null}</span></td>
                                        </tr>
                                        )
                                    })
                                : this.props.t('loading'))}
                            </React.Fragment>
                        );
                    }}
                />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , allStudents: state.adminData.allStudents}
}

const cwrapped = connect(mapStateToProps, { GetAllStudents })(adminStudents);

export default withTranslation()(cwrapped)
