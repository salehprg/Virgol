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


    paginate = (num) => {
        this.setState({ currentPage: num })
        this.queriedStudents(this.state.query , num)
    }

    render() {
        if(this.state.loading) loading('tw-w-10 tw-text-grayish centerize')
        return (
            <div className="tw-w-full tw-mt-10">
                <PlusTable 
                    title={this.props.t('studentsList')}
                    isLoading={this.state.loading}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    cardsPerPage={this.state.itemsPerPage}
                    totalCards={this.state.totalCard}
                    paginate={this.paginate}
                    currentPage={this.state.currentPage}
                    button={() => null}
                    headers={[this.props.t('firstName'), this.props.t('lastName'), this.props.t('phoneNumber'), this.props.t('nationCode'), this.props.t('fatherName'), this.props.t('fatherPhoneNumber'),this.props.t('completedAccount'), this.props.t('confirmedAccount') ,this.props.t('className')]}
                    body={() => {

                        return (
                            <React.Fragment>
                                {(this.state.students ?
                                    this.state.students.map(x => {
                                        return(
                                        <tr>
                                            {/*<td><input type="checkbox" value={x.id} onChange={this.handleSelectStudent}></input></td>*/}
                                            <td className="tw-py-4 tw-text-right tw-px-4">{x.firstName}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.lastName}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.phoneNumber}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.melliCode}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.fatherName}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.fatherPhoneNumber}</td>
                                            <td><span className="tw-text-center tw-px-4 tw-py-4">{x.latinFirstname && x.latinLastname ? check_circle('tw-w-8 tw-text-greenish') : null}</span></td>
                                            <td><span className="tw-text-center tw-px-4 tw-py-4">{x.confirmedAcc ? check_circle('tw-w-8 tw-text-greenish') : null}</span></td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.classsname}</td> 
                                                      
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