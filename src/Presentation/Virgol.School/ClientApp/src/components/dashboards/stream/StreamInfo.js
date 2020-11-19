import React from 'react';
import { DatePicker } from "jalali-react-datepicker";
import Select from 'react-select';
import { withTranslation } from 'react-i18next';
import Fieldish from '../../field/Fieldish';
import Tablish from '../tables/Tablish';

class StreamInfo extends React.Component {

    state = {
        done: [{id: 1, name: 'همایش یک', date: '1399/5/2'}, {id: 2, name: 'همایش دو', date: '1399/6/2'}],
        currentStream: null,
        streamName: '',
        startTime: new Date(),
        selectedGuests: [],
        duration: 90,
        guests: [{ value: 'students', label: 'دانش آموزان' }, { value: 'teachers', label: 'معلمان' }]
    }

    setStartTime = ({ value }) => {
        console.log(value);
    }

    handleChangeGuests = (selectedGuests) => {
        this.setState({ selectedGuests });
    }

    setDuration = (e) => {
        this.setState({ duration: e.target.value })
    }

    render() {
        return (
            <div className="w-full overflow-y-auto mt-10 flex flex-row flex-wrap items-center justify-evenly">
                <div className="bg-dark-blue rounded-lg w-full max-w-350 h-80 my-4 mx-2 px-3 py-2">
                    <p className="text-right text-white mb-4"> {this.props.t('finishedConferences')} </p>
                    <Tablish 
                        headers={[this.props.t('name'), this.props.t('date')]}
                        body={() => {
                            return this.state.done.map(x => {
                                return (
                                    <tr key={x.id}>
                                        <td className="py-4"> {x.name} </td>
                                        <td> {x.date} </td>
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
                            return this.state.done.map(x => {
                                return (
                                    <tr key={x.id}>
                                        <td className="py-4"> {x.name} </td>
                                        <td> {x.date} </td>
                                    </tr>
                                );
                            })
                        }}
                    />
                </div>
                <div className="rounded-lg flex flex-col items-center justify-center w-full max-w-350 h-80 mx-2 my-4 px-3 py-2">
                    {this.state.currentStream ? 
                    <>
                        <div className="w-full text-right py-4 px-4 text-white border-2 border-greenish rounded-lg">
                            <p className="text-xl mb-4 text-center"> {this.props.t('activeStream')} </p>
                            <p> همایش سه </p>
                            <div className="flex my-2 flex-row-reverse justify-between">
                                <p>1399/10/4 - 10:00</p>
                                <p>90'</p>
                            </div>
                            <div>
                                <p className="mb-2"> {this.props.t('streamUrl')} </p>
                                <p className="text-left border-2 break-all overflow-hidden rounded-lg px-2 py-1 border-sky-blue">https://conf.legace.ir/dash/livestream.mpd</p>
                            </div>
                            <div className="mt-2">
                                <p className="mb-2"> {this.props.t('streamKey')} </p>
                                <p className="text-left border-2 break-all overflow-hidden rounded-lg px-2 py-1 border-purplish">646764535454</p>
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
                            <DatePicker value={this.state.startTime} onClickSubmitButton={this.setStartTime} />
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
                        <button className="bg-greenish rounded-lg text-white w-5/6 py-2"> {this.props.t('reserveConference')} </button>
                    </> 
                    }
                </div>
            </div>
        );
    }

}

export default withTranslation()(StreamInfo);