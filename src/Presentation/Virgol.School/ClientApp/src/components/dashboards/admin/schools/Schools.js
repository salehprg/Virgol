import React from "react";
import PlusTable from "../../tables/PlusTable";
import { edit } from "../../../../assets/icons";
import history from "../../../../history";

class Schools extends React.Component {

    state = { loading: false, query: '' }

    componentDidMount() {
        if (this.props.history.action === 'POP') {
            this.setState({ loading: true })
            // api calls
            this.setState({ loading: false })
        }
    }

    changeQuery = query => {
        this.setState({ query })
    }

    render() {
        return (
            <div className="w-full mt-10">
                <PlusTable
                    title="لیست مدارس تحت پوشش"
                    isLoading={this.state.loading}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    button={() => {
                        return (
                            <button className="px-6 py-1 border-2 border-sky-blue text-sky-blue rounded-lg">مدرسه جدید</button>
                        );
                    }}
                    headers={['نام مدرسه', 'کد', 'نوع', 'مدیر', '']}
                    body={() => {
                        return (
                            <React.Fragment>
                                <tr>
                                    <td className="py-4">شهید هاشمی نژاد 1</td>
                                    <td>#568425</td>
                                    <td>سمپاد</td>
                                    <td>احسان فاضلی</td>
                                    <td className="cursor-pointer" onClick={() => history.push(`/school/${2}`)}>
                                        {edit('w-6 text-white')}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-4">شهید هاشمی نژاد 1</td>
                                    <td>#568425</td>
                                    <td>سمپاد</td>
                                    <td>احسان فاضلی</td>
                                    <td className="cursor-pointer" onClick={() => history.push(`/school/${3}`)}>
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

export default Schools;