import React from "react";
import PlusTable from "../../tables/PlusTable";
import { edit } from "../../../../assets/icons";
import history from "../../../../history";

class Teachers extends React.Component {

    state = { loading: false, query: '' }

    // componentDidMount = async () => {
    //     if (this.props.history.action === 'POP' || this.props.schools.length == 0 ) {
    //         this.setState({ loading: true })
    //         await this.props.getSchools(this.props.user.token);
    //         this.setState({ loading: false })
    //     }
    // }

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
                            <button className="px-6 py-1 border-2 border-sky-blue text-sky-blue rounded-lg">معلم جدید</button>
                        );
                    }}
                    headers={['نام', 'نام خانوادگی', 'کد ملی', 'واحد تدریس']}
                    body={() => {
                        return (
                            <React.Fragment>
                                <tr>
                                    <td className="py-4">صالح</td>
                                    <td>ابراهیمیان</td>
                                    <td>1053645896</td>
                                    <td>25</td>
                                    <td className="cursor-pointer" onClick={() => history.push(`/teacher/${2}`)}>
                                        {edit('w-6 text-white')}
                                    </td>            
                                </tr>
                            </React.Fragment>
                        );
                    }}
                />
            </div>
        );
    }

}

export default Teachers;