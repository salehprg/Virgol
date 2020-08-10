import React from "react";
import PlusTable from "../../tables/PlusTable";
import { edit } from "../../../../assets/icons";
import history from "../../../../history";
import { connect } from "react-redux";
import {getAllTeachers} from "../../../../_actions/managerActions"

class Teachers extends React.Component {

    state = { loading: false, query: '' }

    componentDidMount = async () => {
        if (this.props.history.action === 'POP' || this.props.teachers.length === 0 ) {
            this.setState({ loading: true })
            await this.props.getAllTeachers(this.props.user.token);
            this.setState({ loading: false })
        }
    }

    changeQuery = query => {
        this.setState({ query })
    }

    submitExcel = (excel) => {

    }

    render() {
        if(this.state.loading) return "لودینگ..."
        return (
            <div className="w-full mt-10">
                <PlusTable
                    title="لیست معلمان"
                    isLoading={this.state.loading}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    button={() => {
                        return (
                            <button className="px-6 py-1 border-2 border-sky-blue text-sky-blue rounded-lg">معلم جدید</button>
                        );
                    }}
                    excel="آپلود اکسل معلمان"
                    handleExcel={this.submitExcel}
                    headers={['نام', 'نام خانوادگی', 'کد ملی', 'واحد تدریس']}
                    body={() => {
                        return (
                            <React.Fragment>
                                {
                                    this.props.teachers.map(x => {
                                        if(x.firstName.includes(this.state.query))
                                        {
                                            return(
                                            <tr>
                                                <td className="py-4">{x.firstName}</td>
                                                <td>{x.lastName}</td>
                                                <td>{x.melliCode}</td>
                                                <td>{x.moodle_Id}</td>
                                                <td className="cursor-pointer" onClick={() => history.push(`/teacher/${x.id}`)}>
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
    return {user: state.auth.userInfo , teachers: state.managerData.teachers}
}

export default connect(mapStateToProps, { getAllTeachers })(Teachers);