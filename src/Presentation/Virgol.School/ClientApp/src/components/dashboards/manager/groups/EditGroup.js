import React from 'react';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import history from '../../../../history'
import Add from '../../../field/Add';
import {styles} from '../../../../selectStyle'

class EditGroup extends React.Component {

    state = { 
        classes: [],
        lessons: [],
        teachers: [{ value: 1, label: 'مقدم' }, { value: 2, label: 'ابراهیمیان' }],
        days: [
            { value: 1, label: this.props.t('saturday') },
            { value: 2, label: this.props.t('sunday') },
            { value: 3, label: this.props.t('monsday') },
            { value: 4, label: this.props.t('tuesday') },
            { value: 5, label: this.props.t('wednesday') },
            { value: 6, label: this.props.t('thursday') },
            { value: 7, label: this.props.t('friday') }
        ],
        times: [],
        selectedClasses: [],
        selectedLesson: null,
        selectedTeacher: null,
        selectedDay: null,
        selectedStartTime: null,
        selectedStartEnd: null
    }

    componentDidMount = async () => {
        const times = [];
        var startTime = 7.0;
        var endTime = 23.0;
        var step = 0.25;//Every 15 minute

        for(var i = startTime ;i <= endTime ;i += step){
            var labelHour = (i < 10 ? '0' + Math.trunc(i) : '' + Math.trunc(i))
            var labelMin = ((i - Math.trunc(i)) == 0 ? '00' : (i - Math.trunc(i)) * 60);
            
            times.push({
                 value: i , label: labelHour + ':' + labelMin 
            })
        }
        this.setState({times})

    }

    handleChangeClass = async (selectedClasses) => {
        this.setState({ selectedClasses });
    };

    handleChangeLesson = selectedLesson => {
        this.setState({ selectedLesson });
    };

    handleChangeTeacher = selectedTeacher => {
        this.setState({ selectedTeacher });
    };

    handleChangeDay = selectedDay => {

        this.setState({ selectedDay });
    };

    handleChangeStart = selectedStartTime => {
        this.setState({ selectedStartTime });
    };

    handleChangeEnd = selectedEndTime => {
        this.setState({ selectedEndTime });
    };

    onSubmit = async (formValues) => {
        if (this.state.selectedDay && this.state.selectedLesson && this.state.selectedTeacher && this.state.selectedStartTime && this.state.selectedEndTime) 
        {
            // var classIds = []
            // this.state.selectedClasses.map(x => classIds.push(x.value));
            // const data = {
            //         schedule : {
            //             dayType : this.state.selectedDay.value,
            //             lessonId : this.state.selectedLesson.value,
            //             teacherId : this.state.selectedTeacher.value,
            //             startHour : this.state.selectedStartTime.value,
            //             endHour : this.state.selectedEndTime.value
            //         },
            //         classIds : classIds
            // }

            // await this.props.AddMixedClassSchedule(this.props.user.token , data);
        }
    }

    render() {
        return (
            <Add
                onCancel={() => history.push('/m/groups')}
                title={this.props.t('newGroup')}
            >
                <div className="tw-w-full" style={{direction : "rtl"}} >
                    <Select
                        styles={styles}
                        isMulti={true}
                        className="tw-w-full tw-mx-auto tw-my-4"
                        value={this.state.selectedClasses}
                        onChange={this.handleChangeClass}
                        options={this.state.classes}
                        placeholder={this.props.t('classes')}
                    />
                    <Select
                        styles={styles}
                        className="tw-w-full tw-mx-auto tw-my-4"
                        value={this.state.selectedLesson}
                        onChange={this.handleChangeLesson}
                        options={this.state.lessons}
                        placeholder={this.props.t('lesson')}
                    />
                    <Select
                        styles={styles}
                        className="tw-w-full tw-mx-auto tw-my-4"
                        value={this.state.selectedTeacher}
                        onChange={this.handleChangeTeacher}
                        options={this.state.teachers}
                        placeholder={this.props.t('teacher')}
                    />
                    <Select
                        styles={styles}
                        className="tw-w-full tw-mx-auto tw-my-4"
                        value={this.state.selectedDay}
                        onChange={this.handleChangeDay}
                        options={this.state.days}
                        placeholder={this.props.t('day')}
                    />
                    <Select
                        styles={styles}
                        className="tw-w-full tw-mx-auto tw-my-4"
                        value={this.state.selectedStartTime}
                        onChange={this.handleChangeStart}
                        options={this.state.times}
                        placeholder={this.props.t('startTime')}
                    />
                    {this.state.selectedStartTime ?
                        <Select
                            styles={styles}
                            className="tw-w-full tw-mx-auto tw-my-4"
                            value={this.state.selectedEndTime}
                            onChange={this.handleChangeEnd}
                            options={this.state.times.filter(el => el.value > this.state.selectedStartTime.value)}
                            placeholder={this.props.t('endTime')}
                        />
                        :
                        null
                    }
                    <button onClick={() => this.onSubmit()} className="tw-w-full tw-py-2 tw-mt-4 tw-text-white tw-bg-purplish tw-rounded-lg"> {this.props.t('save')} </button>
                </div>
            </Add>
        );
    }

}

export default withTranslation()(EditGroup);