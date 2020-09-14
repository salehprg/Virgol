import React from 'react';
import Modal from '../../../modals/Modal';
import Select from 'react-select';
import TimeKeeper from 'react-timekeeper';
import {getAllTeachers } from '../../../../_actions/managerActions'
import {AddClassSchedule , getClassLessons} from '../../../../_actions/classScheduleActions'
import { connect } from 'react-redux';

class AddLesson extends React.Component {

    state = { selectedCourse: null, selectedTeacher: null , selectedDay : 0
             , selectedStartTime: null, selectedEndTime: null, loading : false ,
            teachers : [] , lessons : [] , times : []};

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

    onAddSchedule = async () => {

        if (this.state.selectedDay && this.state.selectedCourse && this.state.selectedTeacher && this.state.selectedStartTime && this.state.selectedEndTime) {
            const classSchedule = {
                classId : parseInt(this.props.classId),
                dayType : this.state.selectedDay.value,
                lessonId : this.state.selectedCourse.value,
                teacherId : this.state.selectedTeacher.value,
                startHour : this.state.selectedStartTime.value,
                endHour : this.state.selectedEndTime.value
            }

            this.props.addLesson(classSchedule);
        }
    }


    // onHandleInput = e => {
    //     let start = e.target.value;
    //
    //     if (!Number(start)) {
    //         return;
    //     }
    //
    //     this.setState({
    //         [e.target.name]: parseInt(start)
    //     });
    // };

    options = [
        { value: 1, label: 'شنبه' },
        { value: 2, label: 'یکشنبه' },
        { value: 3, label: 'دوشنبه' },
        { value: 4, label: 'سه شنبه' },
        { value: 5, label: 'چهار شنبه' },
        { value: 6, label: 'پنجشنبه' },
        { value: 7, label: 'جمعه' }
    ];

    // times = [
    //     { value: 7, label: '07:00' },
    //     { value: 7, label: '07:00' },
    //     { value: 7.5, label: '07:30' },
    //     { value: 8, label: '08:00' },
    //     { value: 8.5, label: '08:30' },
    //     { value: 9, label: '09:00' },
    //     { value: 9.5, label: '09:30' },
    //     { value: 10, label: '10:00' },
    //     { value: 10.5, label: '10:30' },
    //     { value: 11, label: '11:00' },
    //     { value: 11.5, label: '11:30' },
    //     { value: 12, label: '12:00' },
    //     { value: 12.5, label: '12:30' },
    //     { value: 13, label: '13:00' },
    //     { value: 13.5, label: '13:30' },
    //     { value: 14, label: '14:00' },
    //     { value: 14.5, label: '14:30' },
    //     { value: 15, label: '15:00' },
    //     { value: 15.5, label: '15:30' },
    //     { value: 16, label: '16:00' },
    //     { value: 16.5, label: '16:30' },
    //     { value: 17, label: '17:00' },
    //     { value: 17.5, label: '17:30' },
    //     { value: 18, label: '18:00' },
    //     { value: 18.5, label: '18:30' },
    //     { value: 19, label: '19:00' },
    //     { value: 19.5, label: '19:30' },
    //     { value: 20, label: '20:00' }
    // ]

    render() {
        return (
            <Modal cancel={this.props.cancel}>
                <div onClick={(e) => e.stopPropagation()} className="w-11/12 max-w-500 bg-dark-blue px-4 py-6">
                    <p className="text-center text-white my-4">قرار دادن درس در برنامه کلاسی</p>
                    {(this.state.loading ? "درحال بارگذاری ..." :  
                    <React.Fragment>
                        <Select
                            className="w-1/2 mx-auto my-4"
                            value={this.state.selectedCourse}
                            onChange={this.handleChangeCourse}
                            options={this.state.classLessons}
                            placeholder="درس"
                        />
                        <Select
                            className="w-1/2 mx-auto my-4"
                            value={this.state.selectedTeacher}
                            onChange={this.handleChangeTeacher}
                            options={this.state.teachers}
                            placeholder="معلم"
                        />
                        <Select
                            className="w-1/2 mx-auto my-4"
                            value={this.state.selectedDay}
                            onChange={this.handleChangeDay}
                            options={this.options}
                            placeholder="روز"
                        />
                        <Select
                            className="w-1/2 mx-auto my-4"
                            value={this.state.selectedStartTime}
                            onChange={this.handleChangeStart}
                            options={this.state.times}
                            placeholder="ساعت شروع"
                        />
                        {this.state.selectedStartTime ?
                            <Select
                                className="w-1/2 mx-auto my-4"
                                value={this.state.selectedEndTime}
                                onChange={this.handleChangeEnd}
                                options={this.state.times.filter(el => el.value > this.state.selectedStartTime.value)}
                                placeholder="ساعت پایان"
                            />
                            :
                            null
                        }

                        {/*<input type="number" name="startHour" placeholder="ساعت" onChange={this.onHandleInput} value={this.state.startHour} />*/}
                        {/*<input type="number" name="startMin" placeholder="دقیقه" onChange={this.onHandleInput} value={this.state.startMin} />*/}
                        {/*<input type="number" name="endHour" placeholder="ساعت پایان" onChange={this.onHandleInput} value={this.state.endHour} />*/}
                        {/*<input type="number" name="endMin" placeholder="دقیقه پایان" onChange={this.onHandleInput} value={this.state.endMin} />*/}

                        <button className="w-1/2 mx-auto flex justify-center rounded-lg py-2 focus:outline-none focus:shadow-outline my-8 bg-purplish text-white" onClick={this.onAddSchedule} >ثبت</button>
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

export default connect(mapStateToProps , {getAllTeachers , getClassLessons , AddClassSchedule})(AddLesson);