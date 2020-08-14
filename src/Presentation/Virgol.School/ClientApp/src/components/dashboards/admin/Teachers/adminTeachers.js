import React from "react";
import PlusTable from "../../tables/PlusTable";
import {edit, loading, trash} from "../../../../assets/icons";
import history from "../../../../history";
import { connect } from "react-redux";
import {GetAllTeachers} from "../../../../_actions/adminActions"


class adminTeachers extends React.Component {

    state = { loading: false, query: '' , showDeleteModal : false}

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
                    headers={['نام', 'نام خانوادگی', 'کد ملی', 'واحد تدریس']}
                    body={() => {
                        return (
                            <React.Fragment>
                                {(this.props.allTeachers ?
                                    this.props.allTeachers.map(x => {
                                        if(x.firstName.includes(this.state.query))
                                        {
                                            return(
                                            <tr>
                                                <td className="py-4">{x.firstName}</td>
                                                <td>{x.lastName}</td>
                                                <td>{x.melliCode}</td>
                                                <td>{x.moodle_Id}</td>
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