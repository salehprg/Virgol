import React from 'react';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import history from '../../../../history'
import Add from '../../../field/Add';
import Fieldish from '../../../field/Fieldish';

class AddGroup extends React.Component {

    state = { 
        classes: [{ value: 1, label: 'الف' }, { value: 2, label: 'ب' }, { value: 3, label: 'جیم' }],
        lessons: [{ value: 1, label: 'ریاضی' }, { value: 2, label: 'فیزیک' }, { value: 3, label: 'شیمی' }],
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

    componentDidMount() {
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

    handleChangeClass = selectedClasses => {
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

    submit = () => {

    }

    render() {
        return (
            <Add
                onCancel={() => history.push('/m/groups')}
                title={this.props.t('newGroup')}
            >
                <form className="w-full" style={{direction : "rtl"}} onSubmit={this.submit}>
                <Select
                    isMulti={true}
                    className="w-full mx-auto my-4"
                    value={this.state.selectedClasses}
                    onChange={this.handleChangeClass}
                    options={this.state.classes}
                    placeholder={this.props.t('classes')}
                />
                <Select
                    className="w-full mx-auto my-4"
                    value={this.state.selectedLesson}
                    onChange={this.handleChangeLesson}
                    options={this.state.lessons}
                    placeholder={this.props.t('lesson')}
                />
                <Select
                    className="w-full mx-auto my-4"
                    value={this.state.selectedTeacher}
                    onChange={this.handleChangeTeacher}
                    options={this.state.teachers}
                    placeholder={this.props.t('teacher')}
                />
                <Select
                    className="w-full mx-auto my-4"
                    value={this.state.selectedDay}
                    onChange={this.handleChangeDay}
                    options={this.state.days}
                    placeholder={this.props.t('day')}
                />
                <Select
                    className="w-full mx-auto my-4"
                    value={this.state.selectedStartTime}
                    onChange={this.handleChangeStart}
                    options={this.state.times}
                    placeholder={this.props.t('startTime')}
                />
                {this.state.selectedStartTime ?
                    <Select
                        className="w-full mx-auto my-4"
                        value={this.state.selectedEndTime}
                        onChange={this.handleChangeEnd}
                        options={this.state.times.filter(el => el.value > this.state.selectedStartTime.value)}
                        placeholder={this.props.t('endTime')}
                    />
                    :
                    null
                }
                <button type="submit" className="w-full py-2 mt-4 text-white bg-purplish rounded-lg"> {this.props.t('save')} </button>
                </form>
            </Add>
        );
    }

}

export default withTranslation()(AddGroup);