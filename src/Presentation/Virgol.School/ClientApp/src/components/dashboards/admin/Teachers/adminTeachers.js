import React from "react";
import { withTranslation } from 'react-i18next';
import PlusTable from "../../tables/PlusTable";
import {edit, loading , check_circle, trash } from "../../../../assets/icons";
import history from "../../../../history";
import { connect } from "react-redux";
import {GetAllTeachers} from "../../../../_actions/adminActions"
import { querySearch , pagingItems } from "../../../Search/Seaarch";


class adminTeachers extends React.Component {

    state = { loading: false, query: '' , showDeleteModal : false, itemsPerPage: 40, currentPage: 1 , totalCard : 0}

    componentDidMount = async () => {

        this.setState({ loading: true })
        await this.props.GetAllTeachers(this.props.user.token);
        this.setState({ loading: false })

        this.queriedTeachers('');
    }

    changeQuery = query => {
        this.setState({ query })
        this.queriedTeachers(query)
    }

    queriedTeachers = (query , currentPage = -1) => {
        const serachedItems = querySearch(this.props.allTeachers , query ,  (currentPage != -1 ? currentPage : this.state.currentPage) , this.state.itemsPerPage)
        const pagedItems = pagingItems(serachedItems ,  (currentPage != -1 ? currentPage : this.state.currentPage) , this.state.itemsPerPage)

        this.setState({teachers :  pagedItems})
        this.setState({totalCard : serachedItems.length})
    }

    paginate = (num) => {
        this.setState({ currentPage: num })
        this.queriedTeachers(this.state.query , num)
    }

    render() {
        if(this.state.loading || !this.props.allTeachers) loading('tw-w-10 tw-text-grayish centerize')
        return (
            <div className="tw-w-full tw-mt-10">
                <PlusTable
                    title={this.props.t('teachersList')}
                    searchable
                    isLoading={this.state.loading}
                    button={() => {}}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    headers={[this.props.t('firstName'), this.props.t('lastName'), this.props.t('nationCode'), this.props.t('phoneNumber'), this.props.t('personelCode'), this.props.t('completedAccount') , this.props.t('confirmedAccount')]}
                    cardsPerPage={this.state.itemsPerPage}
                    totalCards={this.state.totalCard}
                    paginate={this.paginate}
                    currentPage={this.state.currentPage}
                    body={() => {
                        return (
                            <React.Fragment>
                                {(this.state.teachers ?
                                    this.state.teachers.map(teacher => {
                                        return(
                                        <tr>
                                            <td className="tw-py-4 tw-text-right tw-px-4">{teacher.firstName}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{teacher.lastName}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{teacher.melliCode}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{teacher.phoneNumber}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{teacher.personalIdNUmber}</td>
                                            <td><span className="tw-text-center tw-px-4 tw-py-4">{teacher.latinFirstname && teacher.latinLastname ? check_circle('tw-w-8 tw-text-greenish') : null}</span></td>
                                            <td><span className="tw-text-center tw-px-4 tw-py-4">{teacher.confirmedAcc ? check_circle('tw-w-8 tw-text-greenish') : null}</span></td>
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
    return {user: state.auth.userInfo , allTeachers: state.adminData.allTeachers}
}

const cwrapped = connect(mapStateToProps, { GetAllTeachers })(adminTeachers);

export default withTranslation()(cwrapped);