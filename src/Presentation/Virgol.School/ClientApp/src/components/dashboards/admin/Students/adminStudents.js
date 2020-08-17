import React from "react";
import PlusTable from "../../tables/PlusTable";
import {edit, loading,check_circle, trash} from "../../../../assets/icons";
import history from "../../../../history";
import { connect } from "react-redux";
import {GetAllStudents} from "../../../../_actions/adminActions"


class adminStudents extends React.Component {

    state = { loading: false, query: '' , showDeleteModal : false}

    componentDidMount = async () => {
        console.log("start")
        this.setState({ loading: true })
        await this.props.GetAllStudents(this.props.user.token);
        this.setState({ loading: false })
        console.log("start")

    }

    changeQuery = query => {
        this.setState({ query })
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
                    headers={[ 'نام', 'نام خانوادگی', 'کد ملی' , 'شماره همراه' , 'شماره تماس ولی' , 'حساب تکمیل شده']}
                    body={() => {
                        return (
                            <React.Fragment>
                                {(this.props.allStudents ?
                                    this.props.allStudents.map(x => {
                                        if (x.firstName.includes(this.state.query) || x.lastName.includes(this.state.query) || (x.firstName + " " + x.lastName).includes(this.state.query))
                                        {
                                            return(
                                            <tr>
                                                <td className="py-4">{x.firstName}</td>
                                                <td>{x.lastName}</td>
                                                <td>{x.melliCode}</td>
                                                <td>{x.phoneNumber}</td>
                                                <td>{x.userDetail.fatherPhoneNumber}</td>
                                                <td><span className="text-center">{x.completed ? check_circle('w-8 text-greenish') : null}</span></td>
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