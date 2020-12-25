import React from 'react';
import { withTranslation } from 'react-i18next';
import Modal from '../../../modals/Modal';
import Select from 'react-select';
import Switch from 'react-switch';
import {getAllTeachers } from '../../../../_actions/managerActions'
import {AddClassSchedule , getClassLessons} from '../../../../_actions/classScheduleActions'
import { connect } from 'react-redux';

class AddLesson extends React.Component {

    state = { selectedCourse: null, selectedTeacher: null , selectedDay : 0
             , selectedStartTime: null, selectedEndTime: null, loading : false ,
            teachers : [] , lessons : [] , times : [], weekly: true, week: '0'};

    componentDidMount = async () =>{
        this.setState({loading : true})
        await this.props.getAllTeachers(this.props.user.token);
        await this.props.getClassLessons(this.props.user.token , this.props.classId)
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

    onAddSchedule = async () => {

        if (this.state.selectedDay && this.state.selectedCourse && this.state.selectedTeacher && this.state.selectedStartTime && this.state.selectedEndTime) {
            const classSchedule = {
                classId : parseInt(this.props.classId),
                dayType : this.state.selectedDay.value,
                lessonId : (this.props.IsFreeClass ? 0 : this.state.selectedCourse.value) ,
                customLessonName : (this.props.IsFreeClass ? this.state.selectedCourse : null),
                teacherId : this.state.selectedTeacher.value,
                startHour : this.state.selectedStartTime.value,
                endHour : this.state.selectedEndTime.value,
                weekly : parseInt(this.state.week)
            }

            this.props.addLesson(classSchedule);
        }
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

    handleChange = (event) => {
        this.setState({className: event.target.value});  
    }

    render() {
        return (
            <Modal cancel={this.props.cancel}>
                <div onClick={(e) => e.stopPropagation()} dir="rtl" className="w-11/12 max-w-500 bg-dark-blue px-4 py-6">
                    <p className="text-center text-white my-4"> {this.props.IsFreeClass ? this.props.t('addFreeMeeting') : this.props.t('addLessonToSchedule')} </p>
                    {(this.state.loading ? this.props.t('loading') :  
                    <React.Fragment>
                        {this.props.IsFreeClass ?
                            <div className="w-1/2 mx-auto my-4">
                                <input dir="rtl" placeholder={this.props.t('meetingName')} className="px-4 py-2 text-black focus:outline-none focus:shadow-outline border-2 border-dark-blue rounded-lg" onChange={(e) => this.handleChangeCourse(e.target.value)} value={this.state.selectedCourse} />
                            </div>
                        :
                            <Select
                                escapeClearsValue={true}
                                
                                onInputChange={(e) => console.log(e)}
                                className="w-1/2 mx-auto my-4"
                                value={this.state.selectedCourse}
                                onChange={this.handleChangeCourse}
                                options={this.state.classLessons}
                                placeholder={this.props.t('lesson')}
                            />
                        }
                        <Select
                            className="w-1/2 mx-auto my-4"
                            value={this.state.selectedTeacher}
                            onChange={this.handleChangeTeacher}
                            options={this.state.teachers}
                            placeholder={this.props.IsFreeClass ? this.props.t('host') : this.props.t('teacher')}
                        />
                        <Select
                            className="w-1/2 mx-auto my-4"
                            value={this.state.selectedDay}
                            onChange={this.handleChangeDay}
                            options={this.options}
                            placeholder={this.props.t('day')}
                        />
                        <Select
                            className="w-1/2 mx-auto my-4"
                            value={this.state.selectedStartTime}
                            onChange={this.handleChangeStart}
                            options={this.state.times}
                            placeholder={this.props.t('startTime')}
                        />
                        {this.state.selectedStartTime ?
                            <Select
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

                        {/*<input type="number" name="startHour" placeholder="ساعت" onChange={this.onHandleInput} value={this.state.startHour} />*/}
                        {/*<input type="number" name="startMin" placeholder="دقیقه" onChange={this.onHandleInput} value={this.state.startMin} />*/}
                        {/*<input type="number" name="endHour" placeholder="ساعت پایان" onChange={this.onHandleInput} value={this.state.endHour} />*/}
                        {/*<input type="number" name="endMin" placeholder="دقیقه پایان" onChange={this.onHandleInput} value={this.state.endMin} />*/}

                        <button className="w-1/2 mx-auto flex justify-center rounded-lg py-2 focus:outline-none focus:shadow-outline my-8 bg-purplish text-white" onClick={this.onAddSchedule} > {this.props.t('save')} </button>
                    </React.Fragment>
                    )}
                </div>
            </Modal>
        );
    }

}

const mapStateToProps = state => {
    return {user : state.auth.userInfo , classLessons : state.schedules.classLessons , teachers : state.managerData.teachers}
}

const cwrapped = connect(mapStateToProps , {getAllTeachers , getClassLessons , AddClassSchedule})(AddLesson);

export default withTranslation()(cwrapped);