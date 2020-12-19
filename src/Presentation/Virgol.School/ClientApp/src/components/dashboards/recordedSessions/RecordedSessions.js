import React from 'react';
import { withTranslation } from 'react-i18next';
import PlusTable from '../tables/PlusTable';
import { arrow_left, users } from '../../../assets/icons';
import { connect } from 'react-redux';
import {GetRecordList} from '../../../_actions/meetingActions'
import history from "../../../history";

class RecorededSession extends React.Component {

    state = { loading: false, query: '' }

    componentDidMount = () => {
        var scheduleId = this.props.match.params.id;

        this.props.GetRecordList(this.props.user.token , parseInt(scheduleId))
    }

    changeQuery = (query) => {
        this.setState({ query })
    }

    render() {
        return (
            <div className="w-screen min-h-screen bg-black-blue md:px-16 px-4 pb-6 md:pt-6 pt-24">
                <div onClick={() => this.props.history.goBack()} className="w-10 h-10 cursor-pointer absolute top-0 left-0 mt-6 ml-6 rounded-lg border-2 border-purplish">
                    {arrow_left('w-6 centerize text-purplish')}
                </div>
                <div className="w-full min-h-85 flex md:flex-row flex-col items-center">
                {/* <div className="md:w-1/2 w-full md:mb-0 mb-8">
                    <img className="md:w-5/6 w-full" src="/recorded.svg" alt="recorded svg" />
                </div> */}
                <div className="w-full h-85 overflow-auto">
                <PlusTable
                    title={this.props.t('recordedSessions')}
                    isLoading={false}
                    isPaginate={false}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    button={() => null}
                    headers={[this.props.t('col'), this.props.t('name'), this.props.t('date'), 'ضبط', this.props.t('ParticipantionStatus')]}
                    body={() => {
                        return (

                            (this.props.recordingsList ?
                                (this.props.recordingsList.length === 0 ?
                                    <tr>
                                        <td className="py-4">{this.props.t('noRecordedSession')}</td>
                                    </tr>
                                :
                                this.props.recordingsList.map((x,index) => {
                                    return (
                                        <tr>
                                            <td className="py-4">{index + 1}</td>
                                            <td className="py-4">{x.name} - {this.props.t('session')} {index + 1}</td>
                                            <td className="py-4">{new Date(x.meeting.startTime).toLocaleString('IR-fa')}</td>
                                            <td className="py-4">
                                            <button className="px-8 py-1 m-1 rounded-lg bg-greenish">{this.props.t('download')}</button>
                                            <button onClick={() => window.open(x.url , "_blank")} className="px-8 py-1 m-1 rounded-lg bg-purplish">{this.props.t('view')}</button>
                                            </td>
                                            <td onClick={() => history.push(`/ParticipantInfo/${x.meeting.id}`)}>
                                                {users('w-8 cursor-pointer text-white')}
                                            </td>
                                        </tr>
                                    )
                                }))
                            :
                            <tr>
                                <td className="py-4">{this.props.t('loading')}</td>
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
        user: state.auth.userInfo,
        recordingsList : state.meetingData.recordings
    }
}

const cwrapped = connect(mapStateToProps , {GetRecordList})(RecorededSession)

export default withTranslation()(cwrapped);