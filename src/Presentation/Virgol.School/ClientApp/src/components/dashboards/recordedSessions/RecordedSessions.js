import React from 'react';
import { withTranslation } from 'react-i18next';
import PlusTable from '../tables/PlusTable';
import { arrow_left, edit, users } from '../../../assets/icons';
import { connect } from 'react-redux';
import {GetRecordList} from '../../../_actions/meetingActions'
import history from "../../../history";
import ReactTooltip from 'react-tooltip';

class RecorededSession extends React.Component {

    state = { loading: false, query: '' }

    componentDidMount = () => {
        var scheduleId = this.props.match.params.id;

        this.props.GetRecordList(this.props.user.token , parseInt(scheduleId))
    }

    changeQuery = (query) => {
        this.setState({ query })
    }

    getMinutes = (start , end) => {
        return Math.round((((end.getTime() - start.getTime()) % 86400000) % 3600000) / 60000)
    }

    render() {
        return (
            <div className="tw-w-screen tw-min-h-screen tw-bg-black-blue md:tw-px-16 tw-px-4 tw-pb-6 md:tw-pt-6 tw-pt-24">
                <div onClick={() => this.props.history.goBack()} className="tw-w-10 tw-h-10 tw-cursor-pointer tw-absolute tw-top-0 tw-left-0 tw-mt-6 tw-ml-6 tw-rounded-lg tw-border-2 tw-border-purplish">
                    {arrow_left('tw-w-6 centerize tw-text-purplish')}
                </div>
                <div className="tw-w-full tw-min-h-85 tw-flex tw-mt-6 md:tw-flex-row tw-flex-col tw-items-center">
                {/* <div className="md:tw-w-1/2 tw-w-full md:tw-mb-0 tw-mb-8">
                    <img className="md:tw-w-5/6 tw-w-full" src="/recorded.svg" alt="recorded svg" />
                </div> */}
                <div className="tw-w-full tw-h-85 tw-overflow-auto">
                <PlusTable
                    title={this.props.t('recordedSessions')}
                    isLoading={false}
                    isPaginate={false}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    button={() => null}
                    headers={[this.props.t('col'), this.props.t('name'), this.props.t('date') , "مدت زمان", 'ضبط', this.props.t('ParticipantionStatus')]}
                    body={() => {
                        return (

                            (this.props.recordingsList ?
                                (this.props.recordingsList.length === 0 ?
                                    <tr>
                                        <td className="tw-py-4 tw-text-right">{this.props.t('noRecordedSession')}</td>
                                    </tr>
                                :
                                this.props.recordingsList.map((x,index) => {
                                    return (
                                        <tr>
                                            <td className="tw-py-4 tw-text-right tw-px-4">{index + 1}</td>
                                            <td className="tw-py-4 tw-text-right d-tw-flex tw-flex-wrap">
                                                <div className="tw-ml-2 tw-pt-2 tw-px-4">{x.meeting.meetingName.split('-')[1]} - {this.props.t('session')} {index + 1}</div>
                                                {/* <div data-tip={this.props.t('edit')}> {edit('tw-text-white tw-w-10 tw-bg-greenish tw-rounded-lg tw-p-2')}</div>
                                                <ReactTooltip type="dark" effect="float" place="top"/> */}
                                            </td>
                                            <td className="tw-py-4 tw-text-right tw-px-4">{new Date(x.meeting.startTime).toLocaleString('fa-IR').replace('،' , ' - ')}</td>
                                            <td className="tw-py-4 tw-text-right tw-px-4">{this.getMinutes(new Date(x.meeting.startTime) , new Date(x.meeting.endTime)) + " دقیقه"}</td>
                                            <td className="tw-py-4 tw-text-right tw-px-4">
                                            {x.meeting.recordURL ?
                                                <> 
                                                    <button onClick={() => window.open(x.meeting.downloadURL , "_blank")} className="tw-px-8 tw-py-1 tw-m-1 tw-rounded-lg tw-bg-greenish">{this.props.t('download')}</button>
                                                    <button onClick={() => window.open(x.meeting.recordURL , "_blank")} className="tw-px-8 tw-py-1 tw-m-1 tw-rounded-lg tw-bg-purplish">{this.props.t('view')}</button>
                                                </>
                                            : null}
                                            </td>
                                            <td className="tw-text-right tw-px-4 tw-py-4" onClick={() => history.push(`/ParticipantInfo/${x.meeting.id}`)}>
                                                {users('tw-w-8 tw-cursor-pointer tw-text-white')}
                                            </td>
                                        </tr>
                                    )
                                }))
                            :
                            <tr>
                                <td className="tw-py-4">{this.props.t('loading')}</td>
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