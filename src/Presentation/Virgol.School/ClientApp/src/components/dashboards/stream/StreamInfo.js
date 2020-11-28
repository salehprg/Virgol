import React from 'react';
import { DatePicker } from "jalali-react-datepicker";
import Select from 'react-select';
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";
import Fieldish from '../../field/Fieldish';
import Tablish from '../tables/Tablish';
import {GetEndedStreams , GetFutureStreams , GetCurrentStream 
        , GetRoles , ReserveStream , RemoveStream} from '../../../_actions/streamActions';
import { edit, trash } from '../../../assets/icons';
import DeleteConfirm from '../../modals/DeleteConfirm';
import history from '../../../history';

class StreamInfo extends React.Component {

    state = {
        done: [{id: 1, name: 'همایش یک', date: '1399/5/2'}, {id: 2, name: 'همایش دو', date: '1399/6/2'}],
        currentStream: null,
        streamName: '',
        startTime: new Date(),
        startTime: new Date(),
        selectedGuests: [],
        duration: 90,
        guests: [{ value: 'students', label: 'دانش آموزان' }, { value: 'teachers', label: 'معلمان' }]
    }

    componentDidMount = async () => {
        
        await this.props.GetCurrentStream(this.props.user.token);
        await this.props.GetEndedStreams(this.props.user.token);
        await this.props.GetFutureStreams(this.props.user.token);
        await this.props.GetRoles(this.props.user.token);

        this.initializeRoles()
    }

    initializeRoles = () =>{
        var guestRoles = [];
        this.props.guestRoles.map(x => guestRoles.push({value : x.id , label : this.props.t(x.name)}));

        this.setState({guests : guestRoles});
    }

    setStartTime = ({ value }) => {
        // console.log(value._d);
        // console.log(value._d.toJSON());
        // console.log(value._d.toString());

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
        return (
            <div className="w-full overflow-y-auto mt-10 flex flex-row flex-wrap items-center justify-evenly">
                {this.state.showDeleteModal ? 
                    <DeleteConfirm
                        title={this.props.t('deleteConfirm')}
                        confirm={this.deleteStream}
                        cancel={() => this.setState({ showDeleteModal: false, streamId: 0 })}
                    /> 
                    : 
                    null
                }
                <div className="bg-dark-blue rounded-lg w-full max-w-350 h-80 my-4 mx-2 px-3 py-2">
                    <p className="text-right text-white mb-4"> {this.props.t('finishedConferences')} </p>
                    
                    <Tablish 
                        headers={[this.props.t('name'), this.props.t('date')]}
                        body={() => {
                            return this.props.endedStream.map(x => {
                                return (
                                    <tr key={x.id}>
                                        <td className="py-4"> {x.streamName} </td>
                                        <td> {new Date(x.startTime).toLocaleString('fa-IR').replace('،' , ' - ')} </td>
                                        {/* <td onClick={() => this.showDelete(x.id)} className="cursor-pointer">
                                            {trash('w-6 text-white ')}
                                        </td> */}
                                    </tr>
                                );
                            })
                        }}
                    />
                </div>
                <div className="bg-dark-blue rounded-lg w-full max-w-350 h-80 my-4 mx-2 px-3 py-2">
                <p className="text-right text-white mb-4"> {this.props.t('futureConferences')} </p>
                    <Tablish 
                        headers={[this.props.t('name'), this.props.t('date')]}
                        body={() => {
                            return this.props.futureStream.map(x => {
                                return (
                                    <tr key={x.id}>
                                        <td className="py-4"> {x.streamName} </td>
                                        <td> {new Date(x.startTime).toLocaleString('fa-IR').replace('،' , ' - ')} </td>
                                        <td onClick={() => this.showDelete(x.id)} className="cursor-pointer">
                                            {trash('w-6 text-white ')}
                                        </td>
                                        <td onClick={() => history.push(`/editStream/${x.id}`)} className="cursor-pointer">
                                            {edit('w-6 text-white ')}
                                        </td>
                                    </tr>
                                );
                            })
                        }}
                    />
                </div>
                <div className="rounded-lg flex flex-col items-center justify-center w-full max-w-350 h-80 mx-2 my-4 px-3 py-2">
                    {this.props.currentStream ? 
                    <>
                        <div className="w-full text-right py-4 px-4 text-white border-2 border-greenish rounded-lg">
                            <p className="text-xl mb-4 text-center"> {this.props.t('activeStream')} </p>
                            <p> {this.props.currentStream.streamName} </p>
                            <div className="flex my-2 flex-row-reverse justify-between">
                                <p>{new Date(this.props.currentStream.startTime).toLocaleString('fa-IR').replace('،' , ' - ')}</p>
                                <p>{this.props.currentStream.duration}'</p>
                            </div>
                            <div>
                                <p className="mb-2"> {this.props.t('streamUrl')} </p>
                                <p className="text-left border-2 break-all overflow-hidden rounded-lg px-2 py-1 border-sky-blue">{this.props.currentStream.obS_Link}</p>
                            </div>
                            <div className="mt-2">
                                <p className="mb-2"> {this.props.t('streamKey')} </p>
                                <p className="text-left border-2 break-all overflow-hidden rounded-lg px-2 py-1 border-purplish">{this.props.currentStream.obS_Key}</p>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <input
                            value={this.state.streamName}
                            onChange={(e) => this.setState({streamName : e.target.value})}
                            className="w-5/6 px-4 py-2 rounded-lg bg-transparent border-2 border-dark-blue text-right text-white"
                            placeholder={this.props.t('streamName')}
                        />
                        <div className="w-5/6 my-8 flex flex-row-reverse items-center justify-around">
                            <span className="text-white"> {this.props.t('startTime')} </span>
                            <DatePicker value={this.state.startTime} timePicker={true} onClickSubmitButton={this.setStartTime} />
                        </div>
                        <div className="flex flex-row-reverse items-center justify-start w-5/6">
                            <span className="text-white"> {this.props.t('duration')} </span>
                            <input value={this.state.duration} onChange={this.setDuration} type="number" className="text-center w-1/3 mx-2" />
                            <span className="text-white"> {this.props.t("minute")} </span>
                        </div>
                        <Select
                                className="w-5/6 mx-auto my-8"
                                value={this.state.selctedGuests}
                                onChange={this.handleChangeGuests}
                                options={this.state.guests}
                                placeholder={this.props.t('streamGuests')}
                                isMulti
                                isSearchable
                        />
                        <button className="bg-greenish rounded-lg text-white w-5/6 py-2" onClick={() => this.reserveStream()}> {this.props.t('reserveConference')} </button>
                    </> 
                    }
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