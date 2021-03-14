import React from 'react';
import { DatePicker } from "jalali-react-datepicker";
import Select from 'react-select';
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";
import Fieldish from '../../field/Fieldish';
import Tablish from '../tables/Tablish';
import {GetEndedStreams , GetFutureStreams , GetCurrentStream 
        , GetRoles , ReserveStream , RemoveStream} from '../../../_actions/streamActions';
import { edit, loading, plus, trash } from '../../../assets/icons';
import DeleteConfirm from '../../modals/DeleteConfirm';
import history from '../../../history';
import {styles} from '../../../selectStyle'
import ReactTooltip from 'react-tooltip';
import './styles.css';

class StreamInfo extends React.Component {

    state = {
        done: [{id: 1, name: 'همایش یک', date: '1399/5/2'}, {id: 2, name: 'همایش دو', date: '1399/6/2'}],
        currentStream: null,
        streamName: '',
        startTime: new Date(),
        startTime: new Date(),
        selectedGuests: [],
        duration: 90,
        guests: [{ value: 'students', label: 'دانش آموزان' }, { value: 'teachers', label: 'معلمان' }],
        loading : false
        
    }

    componentDidMount = async () => {
        this.setState({loading : true})
        await this.props.GetCurrentStream(this.props.user.token);
        await this.props.GetEndedStreams(this.props.user.token);
        await this.props.GetFutureStreams(this.props.user.token);
        await this.props.GetRoles(this.props.user.token);

        this.initializeRoles()

        this.setState({loading: false})
    }

    initializeRoles = () =>{
        var guestRoles = [];
        this.props.guestRoles.map(x => guestRoles.push({value : x.id , label : this.props.t(x.name)}));

        this.setState({guests : guestRoles});
    }

    setStartTime = ({ value }) => {

        this.setState({startTime : value._d.toJSON() })
    }

    handleChangeGuests = (selectedGuests) => {
        this.setState({ selectedGuests });
    }

    setDuration = (e) => {
        this.setState({ duration: parseFloat(e.target.value) })
    }

    reserveStream = async () => {
        var allowedRoles = []
        this.state.selectedGuests.map(x => allowedRoles.push(x.value))

        var data = {
            StreamName : this.state.streamName ,
            StartTime : this.state.startTime,
            duration : this.state.duration,
            allowedUsers : allowedRoles

        }
        await this.props.ReserveStream(this.props.user.token , data)

        this.componentDidMount()
    }

    showDelete = (id) => {
        this.setState({showDeleteModal : true , streamId : id})
    }

    deleteStream = async () => {
        await this.props.RemoveStream(this.props.user.token , this.state.streamId)
        this.setState({showDeleteModal : false , streamId : 0})

        this.componentDidMount()
    }

    render() {
        if(this.state.loading) return loading('tw-w-10 tw-text-grayish centerize')
        return (
            <div className="tw-w-full tw-overflow-y-auto tw-mt-10 tw-items-center tw-justify-evenly">
                {this.state.showDeleteModal ? 
                    <DeleteConfirm
                        title={this.props.t('deleteConfirm')}
                        confirm={this.deleteStream}
                        cancel={() => this.setState({ showDeleteModal: false, streamId: 0 })}
                    /> 
                    : 
                    null
                }
                
                <ul 
                className="nav nav-tabs nav-fill tw-flex-column tw-flex-sm-row" 
                id="myTab" 
                role="tablist">
                    <li className="nav-item">
                        <a  
                        className="tw-flex-sm-fill tw-text-sm-center nav-link tw-text-white" 
                        id="goToFuture"
                        data-toggle="tab" 
                        role="tab" 
                        aria-controls="futureConferences"
                        href="#futureConferences"
                        aria-selected="false"
                        >{this.props.t('futureConferences')}
                        </a>
                    </li>

                    <li className="nav-item">
                        <a 
                        id="goToFinished" 
                        role="tab" 
                        data-toggle="tab"
                        aria-controls="finishedConferences" 
                        className="tw-flex-sm-fill tw-text-sm-center nav-link active tw-text-white" 
                        href="#finishedConferences"
                        aria-selected="true"
                        >{this.props.t('finishedConferences')}</a>
                    </li>

                    <li className="nav-item">
                        <a 
                        id="goToActive" 
                        role="tab" 
                        data-toggle="tab"
                        aria-controls="activeStream" 
                        className="tw-flex-sm-fill tw-text-sm-center nav-link tw-text-white" 
                        href="#activeStream"
                        aria-selected="false"
                        >
                            {this.props.currentStream ?
                                this.props.t('activeStream')
                                :
                                "ثبت همایش جدید"
                            }
                        </a>
                    </li>
                </ul>

                <div className="tab-content">
                    <div role="tabpanel" aria-labelledby="goToActive" id="activeStream" className="tab-pane fade tw-rounded-lg tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full tw-max-w-350 tw-h-80 tw-my-4 tw-mx-auto tw-px-3 tw-py-2">
                        {this.props.currentStream ? 
                        <>
                            <div className="tw-w-full tw-text-right tw-py-4 tw-px-4 tw-text-white tw-border-2 tw-border-greenish tw-rounded-lg">
                                <p className="tw-text-xl tw-mb-4 tw-text-center"> {this.props.t('activeStream')} </p>
                                <p> {this.props.currentStream.streamName} </p>
                                <div className="tw-flex tw-my-2 tw-flex-row-reverse tw-justify-between">
                                    <p>{new Date(this.props.currentStream.startTime).toLocaleString('fa-IR').replace('،' , ' - ')}</p>
                                    <p>{this.props.currentStream.duration}'</p>
                                </div>
                                <div>
                                    <p className="tw-mb-2"> {this.props.t('streamUrl')} </p>
                                    <p className="tw-text-left tw-border-2 tw-break-all tw-overflow-hidden tw-rounded-lg tw-px-2 tw-py-1 tw-border-sky-blue">{this.props.currentStream.obS_Link}</p>
                                </div>
                                <div className="tw-mt-2">
                                    <p className="tw-mb-2"> {this.props.t('streamKey')} </p>
                                    <p className="tw-text-left tw-border-2 tw-break-all tw-overflow-hidden tw-rounded-lg tw-px-2 tw-py-1 tw-border-purplish">{this.props.currentStream.obS_Key}</p>
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <input
                                value={this.state.streamName}
                                onChange={(e) => this.setState({streamName : e.target.value})}
                                className="tw-w-full tw-px-4 tw-py-2 tw-rounded-lg tw-bg-transparent tw-border-2 tw-border-dark-blue tw-text-right tw-text-white"
                                placeholder={this.props.t('streamName')}
                            />
                            <div className="tw-w-full tw-my-8 tw-flex tw-flex-row-reverse tw-items-center tw-justify-around">
                                <span className="tw-text-white"> {this.props.t('startTime')} </span>
                                <DatePicker 
                                className="tw-border-2 tw-rounded tw-border-dark-blue tw-bg-transparent tw-py-2 tw-px-2 tw-mb-4 tw-text-white tw-cursor-pointer"
                                value={this.state.startTime} 
                                timePicker={true} 
                                onClickSubmitButton={this.setStartTime}
                                />
                            </div>
                            <div className="tw-flex tw-flex-row-reverse tw-items-center tw-justify-start tw-w-full">
                                <span className="tw-text-white tw-ml-8"> {this.props.t('duration')} </span>
                                <input 
                                value={this.state.duration} 
                                onChange={this.setDuration} 
                                type="number" 
                                className="tw-text-center tw-w-1/3 tw-mx-8 tw-px-2 tw-py-2 tw-border-2 tw-border-dark-blue tw-rounded" 
                                style={{backgroundColor : 'transparent' , color : 'white'}} />
                                <span className="tw-text-white tw-mr-8"> {this.props.t("minute")} </span>
                            </div>
                            <Select
                                    styles={styles}
                                    className="tw-w-full tw-mx-auto tw-my-8"
                                    value={this.state.selctedGuests}
                                    onChange={this.handleChangeGuests}
                                    options={this.state.guests}
                                    placeholder={this.props.t('streamGuests')}
                                    isMulti
                                    isSearchable
                            />
                            <button className="tw-bg-greenish tw-rounded-lg tw-text-white tw-w-full tw-py-2" onClick={() => this.reserveStream()}> {this.props.t('editConference')} </button>
                        </> 
                        }

                        {/* <button data-tip="افزودن همایش جدید" className="tw-bg-greenish tw-rounded-full tw-w-10 tw-text-white">{plus()}</button>
                        <ReactTooltip place="top" effect="float" type="success"/> */}
                    </div>

                    <div role="tabpanel" aria-labelledby="goToFuture" id="futureConferences" className="tab-pane fade tw-bg-dark-blue tw-rounded-lg tw-w-full tw-h-80 tw-my-4 tw-px-3 tw-py-2">
                        {/* <p className="tw-text-right tw-text-white tw-mb-4"> {this.props.t('futureConferences')} </p> */}
                        <Tablish 
                            headers={[this.props.t('name'), this.props.t('date')]}
                            body={() => {
                                return this.props.futureStream.map(x => {
                                    return (
                                        <tr key={x.id}>
                                            <td className="tw-py-4 tw-text-right tw-px-4"> {x.streamName} </td>
                                            <td className="tw-text-right tw-px-4 tw-py-4"> {new Date(x.startTime).toLocaleString('fa-IR').replace('،' , ' - ')} </td>
                                            <td onClick={() => this.showDelete(x.id)} className="tw-cursor-pointer">
                                                {trash('tw-w-6 tw-text-white ')}
                                            </td>
                                            <td onClick={() => history.push(`/editStream/${x.id}`)} className="tw-cursor-pointer tw-px-4 tw-py-4">
                                                {edit('tw-w-6 tw-text-white ')}
                                            </td>
                                        </tr>
                                    );
                                })
                            }}
                        />
                    </div>

                    <div role="tabpanel" aria-labelledby="goToFinished" id="finishedConferences" className="tab-pane fade show active tw-bg-dark-blue tw-w-full tw-rounded-lg  tw-h-80 tw-my-4 tw-px-3 tw-py-2">
                        {/* <p className="tw-text-right tw-text-white tw-mb-4"> {this.props.t('finishedConferences')} </p> */}
                        
                        <Tablish 
                            headers={[this.props.t('name'), this.props.t('date')]}
                            body={() => {
                                return this.props.endedStream.map(x => {
                                    return (
                                        <tr key={x.id}>
                                            <td className="tw-py-4 tw-text-right"> {x.streamName} </td>
                                            <td className="tw-text-right"> {new Date(x.startTime).toLocaleString('fa-IR').replace('،' , ' - ')} </td>
                                            {/* <td onClick={() => this.showDelete(x.id)} className="tw-cursor-pointer">
                                                {trash('tw-w-6 tw-text-white ')}
                                            </td> */}
                                        </tr>
                                    );
                                })
                            }}
                        />
                    </div>

                </div>
                
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , endedStream: state.streamData.endedStream
                                        , futureStream: state.streamData.futureStream
                                        , guestRoles: state.streamData.roles
                                        , currentStream: state.streamData.currentStream}
}

const cwrapped = connect(mapStateToProps, { GetEndedStreams , GetFutureStreams , 
                                            ReserveStream , GetRoles , GetCurrentStream ,
                                            RemoveStream })(StreamInfo);

export default withTranslation()(cwrapped);