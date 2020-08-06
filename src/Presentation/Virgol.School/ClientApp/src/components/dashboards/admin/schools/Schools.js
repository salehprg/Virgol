import React from "react";
import PlusTable from "../../tables/PlusTable";
import { edit } from "../../../../assets/icons";
import history from "../../../../history";
import {getSchools} from "../../../../_actions/adminActions"
import protectedAdmin from "../../../protectedRoutes/protectedAdmin";
import { connect } from "react-redux";

class Schools extends React.Component {

    state = { loading: false, query: '' }

    componentDidMount = async () => {
        if (this.props.history.action === 'POP' || this.props.schools.length == 0 ) {
            this.setState({ loading: true })
            await this.props.getSchools(this.props.user.token);
            this.setState({ loading: false })
        }
    }

    changeQuery = query => {
        this.setState({ query })
    }

    render() {
        if(this.state.loading) return "هیچ مدرسه ای وجود ندارد"
        return (
            <div className="w-full mt-10">
                <PlusTable
                    title="لیست مدارس تحت پوشش"
                    isLoading={this.state.loading}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    button={() => {
                        return (
                            <button onClick={() => history.push('/newSchool')} className="px-6 py-1 border-2 border-sky-blue text-sky-blue rounded-lg">مدرسه جدید</button>
                        );
                    }}
                    headers={['نام مدرسه', 'کد', 'نوع', 'مدیر', '']}
                    body={() => {
                        return (
                            <React.Fragment>
                                {
                                    this.props.schools.map(x => {
                                        if(x.schoolName.includes(this.state.query))
                                        {
                                            return(
                                            <tr>
                                                <td className="py-4">{x.schoolName}</td>
                                                <td>{x.schoolIdNumber}</td>
                                                <td>سمپاد</td>
                                                <td>احسان فاضلی</td>
                                                <td className="cursor-pointer" onClick={() => history.push(`/school/${x.id}`)}>
                                                    {edit('w-6 text-white')}
                                                </td>
                                            </tr>
                                            )
                                        }
                                    })
                                    
                                }
                            </React.Fragment>
                        );
                    }}
                />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , schools: state.adminData.schools}
}

export default connect(mapStateToProps, { getSchools })(Schools);