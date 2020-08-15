import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from "framer-motion";
import Schedule from './Schedule'
import {AddClassSchedule , DeleteClassSchedule , getClassSchedule} from '../../../../_actions/classScheduleActions'
import {getStudentsClass , AssignUserToClass } from '../../../../_actions/managerActions'
import {deleteClass , editClass} from '../../../../_actions/schoolActions'
import { connect } from 'react-redux';
import AddLesson from './AddLesson';
import {plus, x} from "../../../../assets/icons";
import DeleteConfirm from '../../../modals/DeleteConfirm'
import PencilText from '../../../field/PencilText';

class ClassInfo extends React.Component {

    state = {lessons : [], addLesson: false, loading: false , showChangeName: false, classDetail : {}, showAdd: false , className : ""}

    addVariant = {
        open: {
            scaleY: 1,
            opacity: 1
        },
        close: {
            scaleY: 0,
            opacity: 0
        },
        transition: {
            duration: 0.5
        }
    }

    componentDidMount = async () =>{
        this.setState({loading : true})
        await this.props.getClassSchedule(this.props.user.token , this.props.match.params.id)
        await this.props.getStudentsClass(this.props.user.token , this.props.match.params.id)
        this.setState({loading : false})

        const classDetail = this.props.allClass.filter(x => x.id == parseInt(this.props.match.params.id))

        this.setState({classDetail : classDetail[0]})
        
    }

    showDelete = () => {
        this.setState({showDeleteModal : true})
    }

    DeleteClass = async () => {

        await this.props.deleteClass(this.props.user.token , this.props.match.params.id)
        this.setState({showDeleteModal : false})
    }
    

    handleExcel = async excel => {
        await this.props.AssignUserToClass(this.props.user.token , this.props.match.params.id , excel)
        this.componentDidMount()
        this.render()
    }

    addLesson = async (classSchedule) => {
        this.setState({ addLesson: false })
        await this.props.AddClassSchedule(this.props.user.token, classSchedule)
        this.componentDidMount()
        this.render()
    }

    deleteLesson = async (id) => {

        await this.props.DeleteClassSchedule(this.props.user.token , id)
        this.componentDidMount()
        this.render()
    }

    onEdit = async () =>{
        this.setState({ showChangeName: false })
        await this.props.editClass(this.props.user.token , parseInt(this.props.match.params.id) , this.state.className)
    }

    render() {
        return (
            <div onClick={() => this.setState({ showChangeName: false })} className="w-screen min-h-screen p-10 relative bg-bold-blue grid lg:grid-cols-4 grid-cols-1 lg:col-gap-4 xl:col-gap-10 col-gap-10 row-gap-10">
                {this.state.showDeleteModal ? 
                <DeleteConfirm
                    title="آیا از عمل حذف مطمئن هستید؟ این عمل قابلیت بازگشت ندارد!"
                    confirm={this.DeleteClass}
                    cancel={() => this.setState({ showDeleteModal: false})}
                /> 
                : 
                null
                }
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
                    {/* <label htmlFor="excel" className="px-1 cursor-pointer py-1 border-2 border-greenish text-greenish rounded-lg">*/}
                    {/*    {plus('w-4')}*/}
                    {/*</label>*/}
                    {/*<input*/}
                    {/*    onChange={(e) => this.handleExcel(e.target.files[0])}*/}
                    {/*    type="file"*/}
                    {/*    id="excel"*/}
                    {/*    className="hidden"*/}
                    {/*    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"*/}
                    {/*/>*/}
                     {(this.state.loading ? "درحال بارگذاری ..." :
                        (!this.props.students || this.props.students.length === 0 ? 
                            <div className="flex flex-row-reverse justify-between items-center">
                                <p className="text-center text-white">لیست دانش آموزان خالیست</p>
                            </div>
                        :
                        this.props.students.map(x => {
                            return ((x ?
                                        <div className="flex flex-row-reverse justify-between items-center">
                                            <p className="text-right text-white">{x.firstName} {x.lastName}</p>
                                            <p className="text-right text-white">{x.melliCode}</p>
                                        </div>
                                        :
                                        null
                                    ))
                            })
                        )
                     )}
                    <div className={`w-full absolute bottom-0 mb-4 flex flex-row justify-start items-center`}>
                        <div onClick={() => this.setState({ showAdd: !this.state.showAdd})} className={`w-12 cursor-pointer h-12 mx-2 relative rounded-full bg-greenish`}>
                            {this.state.showAdd ?
                                x('w-6 text-white centerize')
                                :
                                plus('w-6 text-white centerize')
                            }
                            <motion.div onClick={(e) => e.stopPropagation()} className="absolute left-0 bottom-0 mb-12 py-6 w-48 bg-black-blue"
                                        animate={this.state.showAdd ? 'open' : 'close'}
                                        transition="transition"
                                        variants={this.addVariant}
                            >
                                <label htmlFor="excel" className="px-6 mb-4 cursor-pointer py-1 border-2 border-greenish text-greenish rounded-lg">
                                    آپلود فایل اکسل
                                </label>
                                <input
                                    onChange={(e) => this.handleExcel(e.target.files[0])}
                                    type="file"
                                    id="excel"
                                    className="hidden"
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                />

                                <button className="w-5/6 cursor-pointer mt-4 py-1 border-2 border-purplish text-purplish rounded-lg">افزودن تکی</button>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <div className="w-full rounded-lg min-h-90 p-4 lg:col-span-3 col-span-1 border-2 border-dark-blue">
                    <div className="flex flex-row-reverse justify-between">
                        <div className="flex flex-row-reverse justify-between">
                            {(this.state.classDetail ?
                            <PencilText 
                                text={this.state.classDetail.className} 
                                className="text-right text-white text-2xl" 
                                show={this.state.showChangeName}
                                showBox={() => this.setState({ showChangeName: true })}
                                value={this.state.className}
                                changeValue={(className) => this.setState({ className  })}
                                submit={this.onEdit}
                            />
                            : null)}
                            {/*{(this.props.classDetail ?*/}
                            {/*    <React.Fragment>*/}
                            {/*        <p className="text-right text-white text-2xl">{this.state.classDetail.className}</p>*/}
                            {/*        <p onClick={() => this.showDelete(this.state.classDetail.id)} className="cursor-pointer">*/}
                            {/*            {trash('w-6 text-white ')}*/}
                            {/*        </p>*/}
                            {/*    </React.Fragment>*/}
                            {/*: null)}*/}
                        </div>
                        <div>
                            <Link className="px-6 py-1 rounded-lg border-2 border-grayish text-grayish" to="/m/bases">بازگشت</Link>
                            <button onClick={() => this.showDelete(this.state.classDetail.id)} className="px-6 py-1 ml-4 rounded-lg border-2 border-redish text-redish">حذف کلاس</button>
                        </div>
                    </div>
                    <div className="my-8">
                        <button onClick={() => this.setState({ addLesson: true })} className="px-6 py-1 bg-greenish text-white rounded-lg mb-2">افزودن درس</button>
                        <div className="border-2 border-dark-blue overflow-auto">
                            {!this.props.loading ?
                                <Schedule
                                    editable={true}
                                    lessons={this.props.schedules}
                                    deleteSchedule={(id)  => this.deleteLesson(id)}
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
    return {user : state.auth.userInfo  , allClass : state.schoolData.allClass , schedules : state.schedules.classSchedules , students : state.managerData.studentsInClass}
}

export default connect(mapStateToProps , {AddClassSchedule , getStudentsClass , 
                                        DeleteClassSchedule , getClassSchedule , 
                                        AssignUserToClass , deleteClass , editClass})(ClassInfo);