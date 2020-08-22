import React from "react";
import PlusTable from "../../tables/PlusTable";
import {edit, loading,check_circle, trash} from "../../../../assets/icons";
import history from "../../../../history";
import { connect } from "react-redux";
import {GetAllStudents} from "../../../../_actions/adminActions"


class adminStudents extends React.Component {

    state = { loading: false, query: '' , showDeleteModal : false, itemsPerPage: 40, currentPage: 1 , totalCard : 0}

    componentDidMount = async () => {
        console.log("start")
        this.setState({ loading: true })
        await this.props.GetAllStudents(this.props.user.token);
        this.setState({ loading: false })
        
        this.setState({totalCard : this.props.allStudents.length})

    }

    changeQuery = query => {
        this.setState({ query })
    }

    paginate = (num) => {
        this.setState({ currentPage: num })
    }

    render() {
        if(this.state.loading || !this.props.allStudents) loading('w-10 text-grayish centerize')
        return (
            <div className="w-full mt-10">
                <PlusTable
                    title="لیست دانش آموزان"
                    isLoading={this.state.loading}
                    button={() => {}}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    headers={[ 'نام', 'نام خانوادگی', 'نام مدرسه' , 'کد ملی' , 'تلفن همراه' , 'تلفن تماس ولی' , 'حساب تکمیل شده']}
                    cardsPerPage={this.state.itemsPerPage}
                    totalCards={this.state.totalCard}
                    paginate={this.paginate}
                    currentPage={this.state.currentPage}
                    body={() => {

                        return (
                            <React.Fragment>
                                {(this.props.allStudents ?
                                    this.props.allStudents.slice((this.state.currentPage - 1) * this.state.itemsPerPage,this.state.currentPage  * this.state.itemsPerPage).map(x => {
                                        if (x.firstName.includes(this.state.query) || x.lastName.includes(this.state.query) || (x.firstName + " " + x.lastName).includes(this.state.query))
                                        {
                                            return(
                                            <tr>
                                                <td className="py-4">{x.firstName}</td>
                                                <td>{x.lastName}</td>
                                                <td>{x.schoolName}</td>
                                                <td>{x.melliCode}</td>
                                                <td>{x.phoneNumber}</td>
                                                <td>{x.fatherPhoneNumber}</td>
                                                <td><span className="text-center">{x.latinFirstname ? check_circle('w-8 text-greenish') : null}</span></td>
                                            </tr>
                                            )
                                        }
                                    })
                                : "لودینگ")}
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

export default connect(mapStateToProps, { GetAllStudents })(adminStudents);