import React from 'react'
import { Link } from 'react-router-dom'
import Schedule from './Schedule'
import {AddClassSchedule , EditClassSchedule , DeleteClassSchedule , getClassSchedule} from '../../../../_actions/classScheduleActions'
import {getStudentsClass } from '../../../../_actions/managerActions'
import { connect } from 'react-redux';
import AddLesson from './AddLesson';
import {plus} from "../../../../assets/icons";

class ClassInfo extends React.Component {

    state = {lessons : [], addLesson: false, loading: false}

    componentDidMount = async () =>{
        this.setState({loading : true})
        await this.props.getClassSchedule(this.props.user.token , this.props.match.params.id)
        await this.props.getStudentsClass(this.props.user.token , this.props.match.params.id)
        this.setState({loading : false})

        const lessons = [];

        this.props.schedules.map(day => {
            (day.map(lesson => {
                lessons.push({i: lesson.id + '', name: lesson.orgLessonName, teachername: lesson.firstName + " " + lesson.lastName, c: "bg-purplish", x: (lesson.startHour - 8) * 2 + 2, y: lesson.dayType, w: (lesson.endHour - lesson.startHour) * 2, h: 1, static: true})
            }))
        })

        this.setState({lessons : lessons})

    }

    addLesson = async (classSchedule) => {
        this.setState({ addLesson: false })
        await this.props.AddClassSchedule(this.props.user.token, classSchedule)
    }

    handleExcel = excel => {

    }

    render() {
        return (
            <div className="w-screen min-h-screen p-10 relative bg-bold-blue grid lg:grid-cols-4 grid-cols-1 lg:col-gap-4 xl:col-gap-10 col-gap-10 row-gap-10">
                {this.state.addLesson ? 
                <AddLesson
                    addLesson={this.addLesson}
                    classId={this.props.match.params.id}
                    cancel={() => this.setState({ addLesson: false })}
                /> 
                : 
                null
                }
                <div className="w-full relative rounded-lg lg:min-h-90 text-center min-h-0 py-6 px-4 col-span-1 border-2 border-dark-blue">
                     <p className="text-xl text-white mb-8">لیست دانش آموزان</p>
                     {(this.state.loading ? "درحال بارگذاری ..." :
                        (!this.props.students || this.props.students.length == 0 ? 
                            <div className="flex flex-row-reverse justify-between items-center">
                                <p className="text-center text-white">لیست دانش آموزان خالیست</p>
                            </div>
                        :
                        this.props.students.map(x => {
                            return (
                            <div className="flex flex-row-reverse justify-between items-center">
                                <p className="text-right text-white">{x.firstName} {x.lastName}</p>
                                <p className="text-right text-white">{x.melliCode}</p>
                            </div>
                        )}))
                     )}
                     <div className="flex flex-row-reverse justify-center items-center mb-8">
                         <p className="text-xl text-white">لیست دانش آموزان</p>
                         <label htmlFor="excel" className="px-1 cursor-pointer mx-4 py-1 border-2 border-greenish text-greenish rounded-lg">
                             {plus('w-4')}
                         </label>
                         <input
                             onChange={(e) => this.handleExcel(e.target.files[0])}
                             type="file"
                             id="excel"
                             className="hidden"
                             accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                         />
                     </div>
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
                            {!this.state.loading ?
                                <Schedule
                                    editable={true}
                                    lessons={this.state.lessons}
                                    // lessons={[
                                    //     {i: "1", name: "حسابان 1", teachername: "احمدی", c: "bg-redish cursor-pointer", x: 8, y: 1, w: 2, h: 1, static: true},
                                    //     {i: "2", name: "هندسه 1", teachername: "باقری", c: "bg-purplish cursor-pointer", x: 6, y: 2, w: 3, h: 1, static: true},
                                    // ]}
                                />
                                :
                                "loading"
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user : state.auth.userInfo , classes :  state.schoolData.classes , schedules : state.schedules.classSchedules , students : state.managerData.studentsInClass}
}

export default connect(mapStateToProps , {AddClassSchedule , getStudentsClass , DeleteClassSchedule , getClassSchedule})(ClassInfo);