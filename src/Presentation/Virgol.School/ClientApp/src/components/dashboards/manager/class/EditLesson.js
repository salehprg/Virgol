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
    state = { selectedCourse: null, selectedTeacher: null , selectedDay : 0
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

    handleChangeCourse = selectedCourse => {
        this.setState({ selectedCourse });
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

    handleWeeklyChange = (checked) => {
        this.setState({ weekly: !checked , week : "1"});
    }

    handleWeek = (week) => {
        this.setState({ week })
    }

    options = [
        { value: 1, label: this.props.t('saturday') },
        { value: 2, label: this.props.t('sunday') },
        { value: 3, label: this.props.t('monday') },
        { value: 4, label: this.props.t('tuesday') },
        { value: 5, label: this.props.t('wednesday') },
        { value: 6, label: this.props.t('thursday') },
        { value: 7, label: this.props.t('friday') }
    ];

    editSchedule = async () => {

        if (this.state.selectedDay && this.state.selectedCourse && this.state.selectedTeacher && this.state.selectedStartTime && this.state.selectedEndTime) {
            const newSchedule = {
                classId : parseInt(this.props.info.classId),
                dayType : this.state.selectedDay.value,
                lessonId : this.state.selectedCourse.value,
                teacherId : this.state.selectedTeacher.value,
                startHour : this.state.selectedStartTime.value,
                endHour : this.state.selectedEndTime.value,
                weekly : parseInt(this.state.week) ,
                id : this.props.info.id
            }

            await this.props.onEdit(newSchedule)

        }
    
    }

    render() { 
        return ( 
            <Modal cancel={this.props.cancel}>
                <div onClick={e => e.stopPropagation()} className='overflow-y-scroll h-full w-11/12 bg-dark-blue max-w-500 px-4 py-6'>
                    <p className='text-center text-white '>{this.props.t('editClassSchedule')}</p>

                    {this.state.loading ? this.props.t('loading')  :

                        <React.Fragment>
                            <Select
                                styles={styles}
                                className="w-1/2 mx-auto my-4 bg-transparent"
                                value={this.state.selectedCourse}
                                onChange={this.handleChangeCourse}
                                options={this.state.classLessons}
                                placeholder={this.props.t('lesson')}
                            />
                            <Select
                                styles={styles}
                                className="w-1/2 mx-auto my-4"
                                value={this.state.selectedTeacher}
                                onChange={this.handleChangeTeacher}
                                options={this.state.teachers}
                                placeholder={this.props.t('teacher')}
                            />
                            <Select
                                styles={styles}
                                className="w-1/2 mx-auto my-4"
                                value={this.state.selectedDay}
                                onChange={this.handleChangeDay}
                                options={this.options}
                                placeholder={this.props.t('day')}
                            />



                            <Select
                                styles={styles}
                                className="w-1/2 mx-auto my-4"
                                value={this.state.selectedStartTime}
                                onChange={this.handleChangeStart}
                                options={this.state.times}
                                placeholder={this.props.t('startTime')}
                            />
                            {this.state.selectedStartTime ?
                                <Select
                                    styles={styles}
                                    className="w-1/2 mx-auto my-4"
                                    value={this.state.selectedEndTime}
                                    onChange={this.handleChangeEnd}
                                    options={this.state.times.filter(el => el.value > this.state.selectedStartTime.value)}
                                    placeholder={this.props.t('endTime')}
                                />
                                :
                                null
                            }


                            <div className="w-1/2 mx-auto my-4 flex flex-row-reverse justify-between items-center">
                                <p className="text-white"> {this.props.t('everyOtherWeek')} </p>
                                <Switch
                                    onChange={this.handleWeeklyChange}
                                    checked={!this.state.weekly}
                                    className="react-switch"
                                    uncheckedIcon={false}
                                    checkedIcon={false}
                                />
                            </div>

                            <div className={`w-1/2 mx-auto my-4 flex flex-row-reverse justify-between items-center ${this.state.weekly ? 'hidden' : 'block'}`}>
                                <span className="text-white"> {this.props.t('week')} </span>
                                <span onClick={() => this.handleWeek('1')} className={`w-1/3 text-center py-1 cursor-pointer border-2 ${this.state.week === '1' ? 'border-redish text-redish' : 'border-grayish text-grayish'}`}> {this.props.t('even')} </span>
                                <span onClick={() => this.handleWeek('2')} className={`w-1/3 text-center py-1 cursor-pointer border-2 ${this.state.week === '2' ? 'border-sky-blue text-sky-blue' : 'border-grayish text-grayish'}`}> {this.props.t('odd')} </span>
                            </div>
                        </React.Fragment>
                    }
                    <button className="w-1/2 mx-auto flex justify-center rounded-lg py-2 focus:outline-none focus:shadow-outline my-8 bg-greenish text-white" onClick={this.editSchedule}> {this.props.t('save')} </button>                </div>
            </Modal>
         );
    }
}
 
const mapStateToProps = state => {
    return {user : state.auth.userInfo , classLessons : state.schedules.classLessons , teachers : state.managerData.teachers}
}

const connected = connect(mapStateToProps , {getAllTeachers , getClassLessons , EditClassSchedule})(EditLesson)

export default withTranslation()(connected);