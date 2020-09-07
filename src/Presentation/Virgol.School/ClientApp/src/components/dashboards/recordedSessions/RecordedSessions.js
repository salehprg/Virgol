import React from 'react';
import PlusTable from '../tables/PlusTable';
import { arrow_left } from '../../../assets/icons';

class RecorededSession extends React.Component {

    state = { loading: false, query: '' }

    changeQuery = (query) => {
        this.setState({ query })
    }

    render() {
        return (
            <div className="w-screen min-h-screen bg-black-blue md:px-16 px-4 pb-6 md:pt-6 pt-24">
                <div className="w-10 h-10 cursor-pointer absolute top-0 left-0 mt-6 ml-6 rounded-lg border-2 border-purplish">
                    {arrow_left('w-6 centerize text-purplish')}
                </div>
                <div className="w-full min-h-85 flex md:flex-row flex-col items-center">
                <div className="md:w-1/2 w-full md:mb-0 mb-8">
                    <img className="md:w-5/6 w-full" src="/recorded.svg" alt="recorded svg" />
                </div>
                <div className="md:w-1/2 w-full h-85 overflow-auto">
                <PlusTable
                            title="لیست جلسات ضبط شده"
                            isLoading={this.state.loading}
                            query={this.state.query}
                            changeQuery={this.changeQuery}
                            button={() => null}
                            headers={['ردیف', 'تاریخ', 'ساعت', '', '']}
                            body={() => {
                                return (
                                    <React.Fragment>
                                        <tr>
                                            <td className="py-4">1</td>
                                            <td className="py-4">1399/5/4</td>
                                            <td className="py-4">8 تا 9</td>
                                            <td className="py-4">
                                                <button className="px-8 py-1 m-1 rounded-lg bg-greenish">دانلود</button>
                                                <button className="px-8 py-1 m-1 rounded-lg bg-purplish">مشاهده</button>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                );
                            }}
                        />
                </div>
                </div>
            </div>
        );
    }

}

export default RecorededSession;