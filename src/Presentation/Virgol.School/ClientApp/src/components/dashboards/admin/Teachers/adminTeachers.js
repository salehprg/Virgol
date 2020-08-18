import React from "react";
import PlusTable from "../../tables/PlusTable";
import {edit, loading , check_circle, trash } from "../../../../assets/icons";
import history from "../../../../history";
import { connect } from "react-redux";
import {GetAllTeachers} from "../../../../_actions/adminActions"


class adminTeachers extends React.Component {

    state = { loading: false, query: '' , showDeleteModal : false, itemsPerPage: 20, currentPage: 1}

    componentDidMount = async () => {
        console.log("start")
        this.setState({ loading: true })
        await this.props.GetAllTeachers(this.props.user.token);
        this.setState({ loading: false })
        console.log("end")
    }

    changeQuery = query => {
        this.setState({ query })
    }

    paginate = (num) => {
        this.setState({ currentPage: num })
    }

    render() {
        if(this.state.loading || !this.props.allTeachers) loading('w-10 text-grayish centerize')
        return (
            <div className="w-full mt-10">
                <PlusTable
                    title="لیست معلمان"
                    isLoading={this.state.loading}
                    button={() => {}}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    headers={['نام', 'نام خانوادگی', 'کد ملی', 'تلفن تماس' , 'کد پرسنلی' , 'حساب تکمیل شده']}
                    cardsPerPage={this.state.itemsPerPage}
                    totalCards={60}
                    paginate={this.paginate}
                    currentPage={this.state.currentPage}
                    body={() => {
                        return (
                            <React.Fragment>
                                {(this.props.allTeachers ?
                                    this.props.allTeachers.map(teacher => {
                                        if (teacher.firstName.includes(this.state.query) || teacher.lastName.includes(this.state.query) || (teacher.firstName + " " + teacher.lastName).includes(this.state.query))
                                        {
                                            return(
                                            <tr>
                                                <td className="py-4">{teacher.firstName}</td>
                                                <td>{teacher.lastName}</td>
                                                <td>{teacher.melliCode}</td>
                                                <td>{teacher.phoneNumber}</td>
                                                <td>{teacher.teacherDetail.personalIdNUmber}</td>
                                                <td><span className="text-center">{teacher.completed ? check_circle('w-8 text-greenish') : null}</span></td>
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
    return {user: state.auth.userInfo , allTeachers: state.adminData.allTeachers}
}

export default connect(mapStateToProps, { GetAllTeachers })(adminTeachers);