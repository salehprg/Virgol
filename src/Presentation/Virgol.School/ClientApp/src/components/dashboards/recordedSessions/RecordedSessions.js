import React from 'react';
import PlusTable from '../tables/PlusTable';
import { arrow_left } from '../../../assets/icons';
import { connect } from 'react-redux';
import {GetRecordList} from '../../../_actions/meetingActions'
import { arraySwap } from 'redux-form';

class RecorededSession extends React.Component {

    state = { loading: false, query: '' }

    componentDidMount = async () => {
        var scheduleId = this.props.match.params.id;

        await this.props.GetRecordList(parseInt(scheduleId))
    }

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
                    headers={['ردیف', , 'نام' , 'تاریخ', 'ساعت', '', '']}
                    body={() => {
                        return (

                            (this.props.recordingsList ? 
                                (this.props.recordingsList.length == 0 ?
                                    <tr>
                                        <td className="py-4">هیچ کلاس ضبط شده ای وجود ندارد</td>
                                    </tr>
                                :
                                this.props.recordingsList.map((x,index) => {
                                    return (
                                        <tr>
                                            <td className="py-4">{index + 1}</td>
                                            <td className="py-4">{x.name} - جلسه {index + 1}</td>
                                            <td className="py-4">1399/5/4</td>
                                            <td className="py-4">8 تا 9</td>
                                            <td className="py-4">
                                                <button className="px-8 py-1 m-1 rounded-lg bg-greenish">دانلود</button>
                                                <button onClick={() => window.open(x.url , "_blank")} className="px-8 py-1 m-1 rounded-lg bg-purplish">مشاهده</button>
                                            </td>
                                        </tr>
                                    )
                                }))
                            : 
                            <tr>
                                <td className="py-4">درحال بارگذاری ...</td>
                            </tr>
                            )
                        );
                    }}
                />
                </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        user: state.auth.userInfo ,
        recordingsList : state.meetingData.recordings
    }
}

export default connect(mapStateToProps , {GetRecordList})(RecorededSession);