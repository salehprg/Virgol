import React from 'react'
import { Link } from 'react-router-dom'
import Schedule from './Schedule'
import {AddClassSchedule , EditClassSchedule , DeleteClassSchedule , getClassSchedule} from '../../../../_actions/classScheduleActions'
import { connect } from 'react-redux';
import AddLesson from './AddLesson';

class ClassInfo extends React.Component {

    state = {lessons : [], addLesson: false}
    componentDidMount = async () =>{
        this.setState({loading : true})
        await this.props.getClassSchedule(this.props.user.token , this.props.match.params.id)
        this.setState({loading : false})

        const lessons = [];

        this.props.schedules.map(day => {
            (day.map(lesson => {
                lessons.push({i: lesson.id + '', name: lesson.orgLessonName, teachername: lesson.firstName + " " + lesson.lastName, c: "bg-redish cursor-pointer", x: (lesson.startHour - 8) * 2 + 2, y: lesson.dayType, w: (lesson.endHour - lesson.startHour) * 2, h: 1, static: true})
            }))
        })

        this.setState({lessons : lessons})

    }

    render() {
        return (
            <div className="w-screen min-h-screen p-10 relative bg-bold-blue grid lg:grid-cols-4 grid-cols-1 lg:col-gap-4 xl:col-gap-10 col-gap-10 row-gap-10">
                {this.state.addLesson ? 
                <AddLesson 
                    cancel={() => this.setState({ addLesson: false })}
                /> 
                : 
                null
                }
                <div className="w-full relative rounded-lg lg:min-h-90 text-center min-h-0 py-6 px-4 col-span-1 border-2 border-dark-blue">
                     <p className="text-xl text-white mb-8">لیست دانش آموزان</p>
                     <div className="flex flex-row-reverse justify-between items-center">
                        <p className="text-right text-white">صالح ابراهیمینا</p>
                        <p className="text-right text-white">1059645869</p>
                     </div>
                     <div className="flex flex-row-reverse justify-between items-center">
                        <p className="text-right text-white">صالح ابراهیمینا</p>
                        <p className="text-right text-white">1059645869</p>
                     </div>
                </div>

                <div className="w-full rounded-lg min-h-90 p-4 lg:col-span-3 col-span-1 border-2 border-dark-blue">
                    <div className="flex flex-row-reverse justify-between">
                        <div>
                            <p className="text-right text-white text-2xl">101</p>
                            <p className="text-right text-white">دهم ریاضی</p>
                        </div>
                        <div>
                            <Link className="px-6 py-1 rounded-lg border-2 border-grayish text-grayish" to="/m/bases">بازگشت</Link>
                        </div>
                    </div>
                    <div className="my-8">
                        <button onClick={() => this.setState({ addLesson: true })} className="px-6 py-1 bg-greenish text-white rounded-lg mb-2">افزودن درس</button>
                        <div className="border-2 border-dark-blue overflow-auto">
                            <Schedule 
                                editable={true}
                                lessons={this.state.lessons}
                                // lessons={[
                                //     {i: "1", name: "حسابان 1", teachername: "احمدی", c: "bg-redish cursor-pointer", x: 8, y: 1, w: 2, h: 1, static: true},
                                //     {i: "2", name: "هندسه 1", teachername: "باقری", c: "bg-purplish cursor-pointer", x: 6, y: 2, w: 3, h: 1, static: true},
                                // ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user : state.auth.userInfo , classes :  state.schoolData.classes , schedules : state.schedules.classSchedules}
}

export default connect(mapStateToProps , {AddClassSchedule , EditClassSchedule , DeleteClassSchedule , getClassSchedule})(ClassInfo);