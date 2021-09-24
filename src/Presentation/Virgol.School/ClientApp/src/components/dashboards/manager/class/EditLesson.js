import React from 'react';
import { connect } from 'react-redux';
import Modal from '../../../modals/Modal';
import {getAllTeachers} from '../../../../_actions/managerActions'
import { getClassLessons , EditClassSchedule} from '../../../../_actions/classScheduleActions'
import { withTranslation } from 'react-i18next';
import {styles} from '../../../../selectStyle'
import Select from 'react-select'
import Switch from 'react-switch'

class EditLesson extends React.Component {
    state = { selectedTeacher: null , selectedDay : 0
        , selectedStartTime: null, selectedEndTime: null, loading : false ,
       teachers : [] , lessons : [] , times : [], weekly: true, week: '0' , nowLessonName : '' ,
        nowLessonTeacher : '' , nowLessonDay : '' , nowLessonStartTime : '' , nowLessonEndTime : '' ,
        lessonIsWeekly : ''}

    componentDidMount = async () =>{

        
        this.setState({loading : true})
        await this.props.getAllTeachers(this.props.user.token);
        // await this.props.getClassLessons(this.props.user.token , this.props.classId)
        this.setState({loading : false})


        if(this.props.teachers)
        {
            this.setState({teachers : this.props.teachers.map(x => {
                    return { value: x.id , label: x.firstName + " " + x.lastName }
                })
            })
        }
        if(this.props.classLessons)
        {
            this.setState({classLessons : this.props.classLessons.map(x => {
                    return { value: x.id , label: x.orgLessonName }
                })
            })
        }

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

    handleWeeklyChange = (checked) => {
        this.setState({ weekly: !checked , week : "1"});
    }

    handleWeek = (week) => {
        this.setState({ week })
    }

    options = [
        { value: 1, label: this.props.t('saturday') },
        { value: 2, label: this.props.t('sunday') },
        { value: 3, label: this.props.t('monsday') },
        { value: 4, label: this.props.t('tuesday') },
        { value: 5, label: this.props.t('wednesday') },
        { value: 6, label: this.props.t('thursday') },
        { value: 7, label: this.props.t('friday') }
    ];

    editSchedule = async () => {

        if (this.state.selectedDay && this.state.selectedTeacher && this.state.selectedStartTime && this.state.selectedEndTime) {
            const newSchedule = {
                classId : parseInt(this.props.info.classId),
                dayType : this.state.selectedDay.value,
                lessonId : this.props.info.lessonId,
                // teacherId : this.state.selectedTeacher.value,
                ListTeacherId : this.state.selectedTeacher.map(t => t.value),
                startHour : this.state.selectedStartTime.value,
                endHour : this.state.selectedEndTime.value,
                weekly : parseInt(this.state.week) ,
                id : this.props.info.id
            }

             this.props.onEdit(newSchedule)

        }
    
    }

    render() { 
        return ( 
            <Modal cancel={this.props.cancel}>
                <div onClick={e => e.stopPropagation()} className='tw-rounded h-3/4 tw-w-11/12 tw-bg-dark-blue tw-max-w-500 tw-px-4 tw-py-6'>
                    <p className='tw-text-center tw-text-white '>{
                        this.props.classLessons[0].grade_Id === 0 ?
                        this.props.t('editSessionSchedule')
                        :
                        this.props.t('editClassSchedule')
                    }</p>

                    {this.state.loading ? this.props.t('loading')  :

                        <React.Fragment>
                            
                            <Select
                                styles={styles}
                                className="tw-w-1/2 tw-mx-auto tw-my-4"
                                value={this.state.selectedTeacher}
                                onChange={this.handleChangeTeacher}
                                isMulti={true}
                                options={this.state.teachers}
                                placeholder={this.props.classLessons[0].grade_Id === 0 ? this.props.t('host') : this.props.t('teacher')}
                            />
                            <Select
                                styles={styles}
                                className="tw-w-1/2 tw-mx-auto tw-my-4"
                                value={this.state.selectedDay}
                                onChange={this.handleChangeDay}
                                options={this.options}
                                placeholder={this.props.t('day')}
                            />



                            <Select
                                styles={styles}
                                className="tw-w-1/2 tw-mx-auto tw-my-4"
                                value={this.state.selectedStartTime}
                                onChange={this.handleChangeStart}
                                options={this.state.times}
                                placeholder={this.props.t('startTime')}
                            />
                            {this.state.selectedStartTime ?
                                <Select
                                    styles={styles}
                                    className="tw-w-1/2 tw-mx-auto tw-my-4"
                                    value={this.state.selectedEndTime}
                                    onChange={this.handleChangeEnd}
                                    options={this.state.times.filter(el => el.value > this.state.selectedStartTime.value)}
                                    placeholder={this.props.t('endTime')}
                                />
                                :
                                null
                            }


                            <div className="tw-w-1/2 tw-mx-auto tw-my-4 tw-flex tw-flex-row-reverse tw-justify-between tw-items-center">
                                <p className="tw-text-white"> {this.props.t('everyOtherWeek')} </p>
                                <Switch
                                    onChange={this.handleWeeklyChange}
                                    checked={!this.state.weekly}
                                    className="react-switch"
                                    uncheckedIcon={false}
                                    checkedIcon={false}
                                />
                            </div>

                            <div className={`tw-w-1/2 tw-mx-auto tw-my-4 tw-flex tw-flex-row-reverse tw-justify-between tw-items-center ${this.state.weekly ? 'tw-hidden' : 'tw-block'}`}>
                                <span className="tw-text-white"> {this.props.t('week')} </span>
                                <span onClick={() => this.handleWeek('1')} className={`tw-w-1/3 tw-text-center tw-py-1 tw-cursor-pointer tw-border-2 ${this.state.week === '1' ? 'tw-border-redish tw-text-redish' : 'tw-border-grayish tw-text-grayish'}`}> {this.props.t('even')} </span>
                                <span onClick={() => this.handleWeek('2')} className={`tw-w-1/3 tw-text-center tw-py-1 tw-cursor-pointer tw-border-2 ${this.state.week === '2' ? 'tw-border-sky-blue tw-text-sky-blue' : 'tw-border-grayish tw-text-grayish'}`}> {this.props.t('odd')} </span>
                            </div>
                        </React.Fragment>
                    }
                    <button className="tw-w-1/2 tw-mx-auto tw-flex tw-justify-center tw-rounded-lg tw-py-2 focus:tw-outline-none focus:tw-shadow-outline tw-my-8 tw-bg-greenish tw-text-white" onClick={this.editSchedule}> {this.props.t('save')} </button>                </div>
            </Modal>
         );
    }
}
 
const mapStateToProps = state => {
    return {user : state.auth.userInfo , classLessons : state.schedules.classLessons , teachers : state.managerData.teachers}
}

const connected = connect(mapStateToProps , {getAllTeachers , getClassLessons , EditClassSchedule})(EditLesson)

export default withTranslation()(connected);