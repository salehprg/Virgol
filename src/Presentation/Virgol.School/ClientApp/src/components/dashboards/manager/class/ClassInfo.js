import React, {createRef} from 'react'
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'
import { motion } from "framer-motion";
import Schedule from './Schedule'
import {AddClassSchedule , DeleteClassSchedule , getClassSchedule} from '../../../../_actions/classScheduleActions'
import {getStudentsClass , UnAssignUserFromClass , AssignUserToClass , AssignUserListToClass } from '../../../../_actions/managerActions'
import {deleteClass , editClass , getAllClass} from '../../../../_actions/schoolActions'
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
        await this.props.getAllClass(this.props.user.token)
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
        await this.props.AssignUserListToClass(this.props.user.token , userIds , parseInt(this.props.match.params.id) , this.state.classDetail.grade_Id == 0);
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

    rerenderIt = () => {
        this.componentDidMount()
        this.render()
    }

    render() {
        return (
            <div onClick={() => this.setState({ showChangeName: false , addStudent : false})} className="tw-w-screen tw-min-h-screen tw-py-16 lg:tw-px-10 tw-px-1 tw-relative tw-bg-bold-blue tw-grid lg:tw-grid-cols-4 tw-grid-cols-1 lg:tw-col-tw-gap-4 xl:tw-col-tw-gap-10 tw-col-tw-gap-10 tw-row-tw-gap-10">
                <div onClick={() => history.goBack()} className="tw-w-10 tw-h-10 tw-cursor-pointer tw-absolute tw-top-0 tw-left-0 tw-mt-4 tw-ml-4 tw-rounded-lg tw-border-2 tw-border-purplish">
                    {arrow_left('tw-w-6 centerize tw-text-purplish')}
                </div>
                {this.state.addStudent ? 
                    <AddStudent IsFreeClass={this.state.classDetail.grade_Id == 0 ? true : false} 
                                onAddStudent={(dataIds) => this.onAddStudent(dataIds)} 
                                cancel={() => this.setState({addStudent : false})} /> 
                                : null}
                                
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
                    IsFreeClass={this.state.classDetail.grade_Id == 0 ? true : false}
                    classId={this.props.match.params.id}
                    cancel={() => this.setState({ addLesson: false })}
                /> 
                : 
                null
                }
                <div className="addStudent lg:tw-row-start-1 tw-row-start-2 tw-w-full tw-relative tw-rounded-lg lg:tw-min-h-90 tw-text-center tw-min-h-0 tw-py-6 tw-px-4 tw-mt-4 tw-col-span-1 tw-border-2 tw-border-dark-blue">
            <p className="tw-text-xl tw-text-white tw-mb-8">{this.state.classDetail.grade_Id == 0 ? this.props.t('participantList') : this.props.t('studentsList')} </p>
                    {/* <label htmlFor="excel" className="tw-px-1 tw-cursor-pointer tw-py-1 tw-border-2 tw-border-greenish tw-text-greenish tw-rounded-lg">*/}
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
                            <div className="tw-flex tw-flex-row-reverse tw-justify-between tw-items-center">
                                <p className="tw-text-center tw-text-white"> {this.state.classDetail.grade_Id == 0 ? this.props.t('emptyParticipantList') : this.props.t('emptyStudentsList')}</p>
                            </div>
                        :
                        this.props.students.map(std => {
                            return ((std ?
                                        <div className="tw-flex tw-flex-row-reverse tw-justify-between tw-items-center">
                                            {/* <input type="checkbox" value={std.id} onChange={this.handleSelectStudent}></input> */}
                                            <span onClick={() => this.showUnassign(std.id)}>{x('tw-w-6 tw-text-redish tw-cursor-pointer')}</span>
                                            <p className="tw-text-right tw-text-white">{std.firstName} {std.lastName}</p>
                                            <p className="tw-text-right tw-text-white">{std.melliCode}</p>
                                        </div>
                                        :
                                        null
                                    ))
                            })
                        )
                     )}
                    <div className={`addStudentBtn tw-transition-all tw-duration-200 tw-absolute tw-bottom-0 tw-mb-4 tw-flex tw-flex-row tw-justify-start tw-items-center`}>
                        <div onClick={() => this.setState({ showAdd: !this.state.showAdd})} className={`tw-w-12 tw-cursor-pointer tw-h-12 tw-mx-2 tw-relative tw-rounded-full tw-bg-greenish`}>
                            {this.state.showAdd ?
                                x('tw-w-6 tw-text-white centerize')
                                :
                                plus('tw-w-6 tw-text-white centerize')
                            }
                            <motion.div onClick={(e) => e.stopPropagation()} className="tw-absolute tw-left-0 tw-bottom-0 tw-mb-12 tw-py-6 tw-w-48 tw-bg-black-blue"
                                        animate={this.state.showAdd ? 'open' : 'close'}
                                        transition="transition"
                                        variants={this.addVariant}
                            >
                                <label htmlFor="excel" className="tw-px-6 tw-mb-4 tw-cursor-pointer tw-py-1 tw-border-2 tw-border-greenish tw-text-greenish tw-rounded-lg">
                                    {this.props.t('uploadExcel')}
                                </label>
                                <input
                                    onChange={(e) => this.handleExcel(e.target.files[0])}
                                    type="file"
                                    id="excel"
                                    className="tw-hidden"
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                />

                        <button onClick={() => this.setState({addStudent : true})} className="tw-w-5/6 tw-cursor-pointer tw-mt-4 tw-py-1 tw-border-2 tw-border-purplish tw-text-purplish tw-rounded-lg">{this.props.t('addSingle')}</button>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <div className="tw-w-full tw-rounded-lg tw-min-h-90 tw-p-4 lg:tw-col-span-3 tw-col-span-1 tw-border-2 tw-border-dark-blue tw-mt-4">
                    <div className="tw-flex tw-flex-row-reverse tw-justify-between">
                        <div className="tw-flex tw-flex-row-reverse tw-justify-between">
                            {(this.state.classDetail ?
                            <PencilText 
                                text={this.state.classDetail.className} 
                                className="tw-text-right tw-text-white tw-text-2xl" 
                                show={this.state.showChangeName}
                                showBox={() => this.setState({ showChangeName: true })}
                                value={this.state.className}
                                changeValue={(className) => this.setState({ className  })}
                                submit={this.onEdit}
                            />
                            : null)}
                            {/*{(this.props.classDetail ?*/}
                            {/*    <React.Fragment>*/}
                            {/*        <p className="tw-text-right tw-text-white tw-text-2xl">{this.state.classDetail.className}</p>*/}
                            {/*        <p onClick={() => this.showDelete(this.state.classDetail.id)} className="tw-cursor-pointer">*/}
                            {/*            {trash('tw-w-6 tw-text-white ')}*/}
                            {/*        </p>*/}
                            {/*    </React.Fragment>*/}
                            {/*: null)}*/}
                        </div>
                        <div>
                            {/*<Link className="tw-px-6 tw-py-1 tw-rounded-lg tw-border-2 tw-border-grayish tw-text-grayish" to="/m/bases">بازگشت</Link>*/}
                            <button onClick={() => this.showDelete(this.state.classDetail.id)} className="tw-px-6 tw-py-1 tw-mx-0 tw-mt-4 tw-ml-0 tw-rounded-lg tw-border-2 tw-border-redish tw-text-redish">{this.state.classDetail.grade_Id == 0 ? this.props.t('deleteRoom') : this.props.t('deleteClass')} </button>
                        </div>
                    </div>
                    <div className="tw-my-8">
                        <button onClick={() => this.setState({ addLesson: true })} className="tw-px-6 tw-py-1 tw-bg-greenish tw-text-white tw-rounded-lg tw-mb-2"> {this.state.classDetail.grade_Id == 0 ? this.props.t('addFreeMeeting') : this.props.t('addLesson')} </button>
                        <div ref={this.sc} className="tw-border-2 tw-border-dark-blue tw-overflow-auto">
                            {!this.props.loading ?
                                <Schedule
                                    isManager={true}
                                    isTeacher={true}
                                    editable={true}
                                    lessons={this.props.schedules}
                                    deleteSchedule={(id)  => this.deleteLesson(id)}
                                    rerenderIt={() => this.rerenderIt()}
                                    // lessons={[
                                    //     {i: "1", name: "حسابان 1", teachername: "احمدی", c: "tw-bg-redish tw-cursor-pointer", x: 8, y: 1, w: 2, h: 1, static: true},
                                    //     {i: "2", name: "هندسه 1", teachername: "باقری", c: "tw-bg-purplish tw-cursor-pointer", x: 6, y: 2, w: 3, h: 1, static: true},
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
    AssignUserToClass , AssignUserListToClass , deleteClass , editClass , getAllClass})(authWrapped);

export default withTranslation()(cwrapped);