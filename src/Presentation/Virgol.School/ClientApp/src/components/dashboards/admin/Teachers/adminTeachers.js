import React from "react";
import { withTranslation } from 'react-i18next';
import PlusTable from "../../tables/PlusTable";
import {edit, loading , check_circle, trash } from "../../../../assets/icons";
import history from "../../../../history";
import { connect } from "react-redux";
import {GetAllTeachers} from "../../../../_actions/adminActions"
import { fullNameSerach , pagingItems } from "../../../Search/Seaarch";


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
        const serachedItems = fullNameSerach(this.props.allTeachers , query ,  (currentPage != -1 ? currentPage : this.state.currentPage) , this.state.itemsPerPage)
        const pagedItems = pagingItems(serachedItems ,  (currentPage != -1 ? currentPage : this.state.currentPage) , this.state.itemsPerPage)

        this.setState({teachers :  pagedItems})
        this.setState({totalCard : serachedItems.length})
    }

    paginate = (num) => {
        this.setState({ currentPage: num })
        this.queriedTeachers(this.state.query , num)
    }

    render() {
        if(this.state.loading || !this.props.allTeachers) loading('w-10 text-grayish centerize')
        return (
            <div className="w-full mt-10">
                <PlusTable
                    title={this.props.t('teachersList')}
                    searchable
                    isLoading={this.state.loading}
                    button={() => {}}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    headers={[this.props.t('firstName'), this.props.t('lastName'), this.props.t('nationCode'), this.props.t('phoneNumber'), this.props.t('personelCode'), this.props.t('completedAccount')]}
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
                                            <td className="py-4">{teacher.firstName}</td>
                                            <td>{teacher.lastName}</td>
                                            <td>{teacher.melliCode}</td>
                                            <td>{teacher.phoneNumber}</td>
                                            <td>{teacher.personalIdNUmber}</td>
                                            <td><span className="text-center">{teacher.latinFirstname && teacher.latinLastname ? check_circle('w-8 text-greenish') : null}</span></td>
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