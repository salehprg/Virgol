import React from 'react';
import Modal from '../../../modals/Modal';
import Select from 'react-select';
import TimeKeeper from 'react-timekeeper';
import {getAllTeachers } from '../../../../_actions/managerActions'
import {AddClassSchedule , getClassLessons} from '../../../../_actions/classScheduleActions'
import { connect } from 'react-redux';

class AddLesson extends React.Component {

    state = { selectedCourse: null, selectedTeacher: null , selectedDay : 0
             , startHour : 0 , startMin : 0 
             , endHour : 0 , endMin : 0 , loading : false , 
            teachers : [] , lessons : []};

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

    onAddSchedule = async () => {
        try
        {
            const classSchedule = {
                classId : parseInt(this.props.classId),
                dayType : this.state.selectedDay.value,
                lessonId : this.state.selectedCourse.value,
                teacherId : this.state.selectedTeacher.value,
                startHour : parseFloat(this.state.startHour + this.state.startMin / 60),
                endHour : parseFloat(this.state.endHour + this.state.endMin / 60)

            }

            await this.props.AddClassSchedule(this.props.user.token , classSchedule)
        }
        catch{}
    }


    onHandleInput = e => {
        let start = e.target.value;

        if (!Number(start)) {
            return;
        }

        this.setState({
            [e.target.name]: parseInt(start)
        });
    };

    options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
    ];

    options = [
        { value: 1, label: 'شنبه' },
        { value: 2, label: 'یکشنبه' },
        { value: 3, label: 'دوشنبه' },
        { value: 4, label: 'سه شنبه' },
        { value: 5, label: 'چهار شنبه' },
        { value: 6, label: 'پنجشنبه' }
    ];
    

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

                        <input type="number" name="startHour" placeholder="ساعت" onChange={this.onHandleInput} value={this.state.startHour} />
                        <input type="number" name="startMin" placeholder="دقیقه" onChange={this.onHandleInput} value={this.state.startMin} />
                        <br />
                        <input type="number" name="endHour" placeholder="ساعت پایان" onChange={this.onHandleInput} value={this.state.endHour} />
                        <input type="number" name="endMin" placeholder="دقیقه پایان" onChange={this.onHandleInput} value={this.state.endMin} />

                        <button onClick={this.onAddSchedule} >ثبت</button>
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