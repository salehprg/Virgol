import React from "react";
import PlusTable from "../../tables/PlusTable";
import { edit } from "../../../../assets/icons";
import history from "../../../../history";
import { connect } from "react-redux";
import {getAllGrades} from "../../../../_actions/managerActions"

class Grades extends React.Component {

    state = { loading: false, query: '' }

    componentDidMount = async () => {
        if (this.props.history.action === 'POP' || this.props.grades.length == 0 ) {
            this.setState({ loading: true })
            await this.props.getAllGrades(this.props.user.token);
            this.setState({ loading: false })
        }
    }

    changeQuery = query => {
        this.setState({ query })
    }

    render() {
        if(this.state.loading) return "لودیمگ..."
        return (
            <div className="w-full mt-10">
                <PlusTable
                    title="لیست معلمان"
                    isLoading={this.state.loading}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    button={() => {
                        return (
                            <button className="px-6 py-1 border-2 border-sky-blue text-sky-blue rounded-lg">دانش آموزان جدید</button>
                        );
                    }}
                    headers={['نام پایه']}
                    body={() => {
                        return (
                            <React.Fragment>
                                {
                                    this.props.grades.map(x => {
                                        if(x.gradeName.includes(this.state.query))
                                        {
                                            return(
                                            <tr>
                                                <td className="py-4">{x.gradeName}</td>
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
    return {user: state.auth.userInfo , grades: state.managerData.grades}
}

export default connect(mapStateToProps, { getAllGrades })(Grades);