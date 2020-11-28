import React from 'react';
import { DatePicker } from "jalali-react-datepicker";
import Select from 'react-select';
import { withTranslation } from 'react-i18next';

class EditStream extends React.Component {

    state = {
        streamName: '',
        startTime: new Date(),
        startTime: new Date(),
        selectedGuests: [],
        duration: 90,
        guests: [{ value: 'students', label: 'دانش آموزان' }, { value: 'teachers', label: 'معلمان' }]
    }

    render() {
        return (
            <div className="w-screen min-h-screen relative bg-black-blue">
                <div className="w-5/6 max-w-350 centerize rounded-lg flex flex-col items-center justify-center px-3 py-2">
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
                </div>    
            </div>
        );
    }

}

export default withTranslation()(EditStream);