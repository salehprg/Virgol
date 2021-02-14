import React from 'react';
import { DatePicker } from "jalali-react-datepicker";
import Select from 'react-select';
import {connect} from 'react-redux';
import {GetRoles , EditReservedStream} from '../../../_actions/streamActions'
import { withTranslation } from 'react-i18next';
import {styles} from '../../../selectStyle'

class EditStream extends React.Component {

    state = {
        streamName: '',
        startTime: new Date(),
        selectedGuests: [],
        duration: 90,
        guests: [{ value: 'students', label: 'دانش آموزان' }, { value: 'teachers', label: 'معلمان' }]
    }

    componentDidMount = async () => {

        await this.props.GetRoles(this.props.user.token);
        this.initializeRoles()
        this.initializeValue(this.props.match.params.id)

    }

    initializeValue = (streamId) => {
        const currentStream = this.props.futureStream.find(x => x.id == streamId)
        var roles = currentStream.allowedRoles.split(",").map(x => {return ((x ? parseInt(x) : 0))});
        
        var test = []
        var selectedGuest = roles.filter(y => y != 0).map(x => {
            return(
                this.state.guests.find(g => g.value == x)
            )
        })
        
        const date = new Date(currentStream.startTime);


        this.setState({streamName : currentStream.streamName , 
                        startTime : date.toJSON() ,
                        duration : currentStream.duration ,
                        selectedGuests : selectedGuest})
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

    editStream = async () => {
        var allowedRoles = []
        this.state.selectedGuests.map(x => allowedRoles.push(x.value))

        var data = {
            Id : parseInt(this.props.match.params.id) ,
            StreamName : this.state.streamName ,
            StartTime : this.state.startTime,
            duration : this.state.duration,
            allowedUsers : allowedRoles

        }
        await this.props.EditReservedStream(this.props.user.token , data)

        this.componentDidMount()
    }

    render() {
        return (
            <div className="tw-w-screen tw-min-h-screen tw-relative tw-bg-black-blue">
                <div className="tw-w-5/6 tw-max-w-350 centerize tw-rounded-lg tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-3 tw-py-2">
                <input
                    value={this.state.streamName}
                    onChange={(e) => this.setState({streamName : e.target.value})}
                    className="tw-w-5/6 tw-px-4 tw-py-2 tw-rounded-lg tw-bg-transparent tw-border-2 tw-border-dark-blue tw-text-right tw-text-white"
                    placeholder={this.props.t('streamName')}
                />
                <div className="tw-w-5/6 tw-my-8 tw-flex tw-flex-row-reverse tw-items-center tw-justify-around">
                    <span className="tw-text-white"> {this.props.t('startTime')} </span>
                    <DatePicker value={this.state.startTime} timePicker={true} onClickSubmitButton={this.setStartTime} />
                </div>
                <div className="tw-flex tw-flex-row-reverse tw-items-center tw-justify-start tw-w-5/6">
                    <span className="tw-text-white"> {this.props.t('duration')} </span>
                    <input value={this.state.duration} onChange={this.setDuration} type="number" className="tw-text-center tw-w-1/3 tw-mx-2" />
                    <span className="tw-text-white"> {this.props.t("minute")} </span>
                </div>
                <Select
                    styles={styles}
                    className="tw-w-5/6 tw-mx-auto tw-my-8"
                    value={this.state.selctedGuests}
                    onChange={this.handleChangeGuests}
                    options={this.state.guests}
                    placeholder={this.props.t('streamGuests')}
                    isMulti
                    isSearchable
                />
                <button className="tw-bg-greenish tw-rounded-lg tw-text-white tw-w-5/6 tw-py-2" onClick={() => this.editStream()}> {this.props.t('editConference')} </button>    
                </div>    
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , futureStream: state.streamData.futureStream
                                        , guestRoles: state.streamData.roles}
}

const cwrapped = connect(mapStateToProps, { GetRoles , EditReservedStream })(EditStream);

export default withTranslation()(cwrapped);