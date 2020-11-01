import React, {createRef} from 'react'
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'
import { motion } from "framer-motion";
import Schedule from './Schedule'
import {AddClassSchedule , DeleteClassSchedule , getClassSchedule} from '../../../../_actions/classScheduleActions'
import {getStudentsClass , UnAssignUserFromClass , AssignUserToClass , AssignUserListToClass } from '../../../../_actions/managerActions'
import {deleteClass , editClass} from '../../../../_actions/schoolActions'
import { connect } from 'react-redux';
import AddLesson from './AddLesson';
import {arrow_left, plus, x} from "../../../../assets/icons";
import DeleteConfirm from '../../../modals/DeleteConfirm'
import PencilText from '../../../field/PencilText';
import AddStudent from './AddStudent'
import protectedManager from "../../../protectedRoutes/protectedManager";
import history from "../../../../history";

class ClassInfo extends React.Component {

    state = {lessons : [], addLesson: false, loading: false , showChangeName: false, selected : [],
        classDetail : {}, showAdd: false , showUnAssignModal : false, className : "" , addStudent : false}

        sc = createRef()

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

        this.sc.current.scrollLeft = this.sc.current.clientWidth
        
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

    onAddStudent = async(userIds) =>{
        await this.props.AssignUserListToClass(this.props.user.token , userIds , parseInt(this.props.match.params.id));
        this.setState({addStudent : false})
        this.componentDidMount()
        this.render()
    }

    deleteLesson = async (id) => {

        await this.props.DeleteClassSchedule(this.props.user.token , id)
        this.componentDidMount()
        this.render()
    }

    handleSelectStudent = (e) =>{
        const event = e;

        if(event.target.checked)
        {
            this.setState({selected : [...this.state.selected, parseInt(event.target.value)]})
        }
        else
        {
            this.setState({selected : this.state.selected.filter(element => element !== parseInt(event.target.value))})
        } 
    }


    showUnassign = (id) => {
        this.setState({selectedStd : id})
        this.setState({showUnAssignModal : true})
    }

    unAssignStudent = async () =>{
        const result = await this.props.UnAssignUserFromClass(this.props.user.token , parseInt(this.props.match.params.id) , [this.state.selectedStd]);
        if(result)
        {
            this.componentDidMount()
            this.render()
        }
    }

    onEdit = async () =>{
        this.setState({ showChangeName: false })
        await this.props.editClass(this.props.user.token , parseInt(this.props.match.params.id) , this.state.className)
    }

    render() {
        return (
            <div onClick={() => this.setState({ showChangeName: false , addStudent : false})} className="w-screen min-h-screen py-16 lg:px-10 px-1 relative bg-bold-blue grid lg:grid-cols-4 grid-cols-1 lg:col-gap-4 xl:col-gap-10 col-gap-10 row-gap-10">
                <div onClick={() => history.push('/m/bases')} className="w-10 h-10 cursor-pointer absolute top-0 left-0 mt-4 ml-4 rounded-lg border-2 border-purplish">
                    {arrow_left('w-6 centerize text-purplish')}
                </div>
                {this.state.addStudent ? <AddStudent onAddStudent={(dataIds) => this.onAddStudent(dataIds)} cancel={() => this.setState({addStudent : false})} /> : null}
                {this.state.showDeleteModal ? 
                    <DeleteConfirm
                        title={this.props.t('deleteConfirm')}
                        confirm={this.DeleteClass}
                        cancel={() => this.setState({ showDeleteModal: false})}
                    /> 
                    : 
                    null
                }
                {this.state.showUnAssignModal ? 
                    <DeleteConfirm
                        title={this.props.t('deleteFromClassConfirm')}
                        confirm={this.unAssignStudent}
                        cancel={() => this.setState({ showUnAssignModal: false , selectedStd : 0})}
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
                <div className="addStudent lg:row-start-1 row-start-2 w-full relative rounded-lg lg:min-h-90 text-center min-h-0 py-6 px-4 col-span-1 border-2 border-dark-blue">
            <p className="text-xl text-white mb-8">{this.props.t('studentsList')}</p>
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
                     {(this.state.loading ? this.props.t('loading') :
                        (!this.props.students || this.props.students.length === 0 ? 
                            <div className="flex flex-row-reverse justify-between items-center">
                                <p className="text-center text-white"> {this.props.t('emptyStudentsList')} </p>
                            </div>
                        :
                        this.props.students.map(std => {
                            return ((std ?
                                        <div className="flex flex-row-reverse justify-between items-center">
                                            {/* <input type="checkbox" value={std.id} onChange={this.handleSelectStudent}></input> */}
                                            <span onClick={() => this.showUnassign(std.id)}>{x('w-6 text-redish cursor-pointer')}</span>
                                            <p className="text-right text-white">{std.firstName} {std.lastName}</p>
                                            <p className="text-right text-white">{std.melliCode}</p>
                                        </div>
                                        :
                                        null
                                    ))
                            })
                        )
                     )}
                    <div className={`addStudentBtn transition-all duration-200 absolute bottom-0 mb-4 flex flex-row justify-start items-center`}>
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
                                    {this.props.t('uploadExcel')}
                                </label>
                                <input
                                    onChange={(e) => this.handleExcel(e.target.files[0])}
                                    type="file"
                                    id="excel"
                                    className="hidden"
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                />

                        <button onClick={() => this.setState({addStudent : true})} className="w-5/6 cursor-pointer mt-4 py-1 border-2 border-purplish text-purplish rounded-lg">{this.props.t('addSingle')}</button>
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
                            {/*<Link className="px-6 py-1 rounded-lg border-2 border-grayish text-grayish" to="/m/bases">بازگشت</Link>*/}
                            <button onClick={() => this.showDelete(this.state.classDetail.id)} className="px-6 py-1 lg:mx-2 mx-0 mt-4 lg:ml-4 ml-0 rounded-lg border-2 border-redish text-redish">حذف کلاس</button>
                        </div>
                    </div>
                    <div className="my-8">
                        <button onClick={() => this.setState({ addLesson: true })} className="px-6 py-1 bg-greenish text-white rounded-lg mb-2"> {this.props.t('addLesson')} </button>
                        <div ref={this.sc} className="border-2 border-dark-blue overflow-auto">
                            {!this.props.loading ?
                                <Schedule
                                    isManager={true}
                                    isTeacher={true}
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

const authWrapped = protectedManager(ClassInfo)

const cwrapped = connect(mapStateToProps , {AddClassSchedule , getStudentsClass , 
    DeleteClassSchedule , getClassSchedule , UnAssignUserFromClass ,
    AssignUserToClass , AssignUserListToClass , deleteClass , editClass})(authWrapped);

export default withTranslation()(cwrapped);