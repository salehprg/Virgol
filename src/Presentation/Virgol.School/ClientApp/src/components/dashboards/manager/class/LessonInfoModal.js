import React from 'react';
import { withTranslation } from 'react-i18next';
import Modal from '../../../modals/Modal';
import history from '../../../../history';
import DeleteConfirm from '../../../modals/DeleteConfirm';
import { edit, external_link, trash } from '../../../../assets/icons';
import { connect } from 'react-redux';
import EditLesson from './EditLesson';
import {EditClassSchedule} from '../../../../_actions/classScheduleActions'

class LessonInfoModal extends React.Component {

    state = { selectedCourse: null, selectedTeacher: null , selectedDay : 0
             , selectedStartTime: null, selectedEndTime: null, loading : false ,
            teachers : [] , lessons : [] , showDeleteModal : false , times : [] , showEditModal : false};

    componentDidMount = async () =>{

        const times = [];
        var startTime = 0.0;
        var endTime = 24.0;
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


    options = [
        { value: 1, label: this.props.t('saturday') },
        { value: 2, label: this.props.t('sunday') },
        { value: 3, label: this.props.t('monsday') },
        { value: 4, label: this.props.t('tuesday') },
        { value: 5, label: this.props.t('wednesday') },
        { value: 6, label: this.props.t('thursday') },
        { value: 7, label: this.props.t('friday') }
    ];

    // times = [
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
    //     { value: 20, label: '20:00' },
    //     { value: 20.5, label: '20:30' },
    //     { value: 21, label: '21:00' },
    //     { value: 21.5, label: '21:30' },
    //     { value: 22, label: '22:00' }
    // ]

    showDelete() {
        this.setState({showDeleteModal : true})
    }

    showEdit(){
        this.setState({showEditModal : true})
    }

    onEdit = async(userIds) =>{
        await this.props.EditClassSchedule(this.props.user.token , userIds );
        this.setState({showEditModal : false})
        this.props.cancel()
        this.componentDidMount()
        this.render()
    }

    render() {
        return (
            <React.Fragment>
                {this.state.showDeleteModal ? 
                <DeleteConfirm
                    title={this.props.t('deleteConfirm')}
                    confirm={() => this.props.onDelete()}
                    cancel={() => this.setState({ showDeleteModal: false})}
                /> 
                : 
                null
                }
                {this.state.showEditModal ?
                    <EditLesson 
                    cancel={() => this.setState({showEditModal : false})}
                    info={this.props.lessonInfo.lessonDetail}
                    onEdit={this.onEdit}
                    />
                    :
                    null
                    //write EditLesson Component here
                }
                <Modal cancel={this.props.cancel}>
                    <div onClick={(e) => e.stopPropagation()} className="w-11/12 max-w-500 rounded-lg bg-dark-blue px-4 py-6">
                        <div>
                            <h2 className="text-center text-white my-4 text-2xl"> {this.props.t('lessonInfo')} </h2>
                        </div>
                      
                        <p className="text-center text-white my-4">{this.props.lessonInfo.lessonDetail.orgLessonName}</p>
                        {(!this.props.isTeacher || this.props.isManager ? <p className="text-center text-white my-4">{this.props.lessonInfo.lessonDetail.firstName + " " + this.props.lessonInfo.lessonDetail.lastName}</p> : null )}
                        {(!this.props.isTeacher ? <p className="text-center text-white my-4">{this.props.t('absents')} : {this.props.lessonInfo.lessonDetail.absenceCount}</p>  
                        : 
                        (!this.props.isManager ? <p className="text-center text-white my-4">{this.props.t('school')} {this.props.lessonInfo.lessonDetail.schoolName} ({this.props.t('class')} {this.props.lessonInfo.lessonDetail.className})</p> : null)
                        )}

                        {(this.props.isManager ? <p className="text-center text-white my-4">({this.props.t('class')} {this.props.lessonInfo.lessonDetail.className})</p> : null)}

                        {(this.state.times.length > 0 ?
                        <p className="text-center text-white my-4">
                            {`${this.state.times.find(x => x.value == this.props.lessonInfo.lessonDetail.endHour).label} ${this.props.lessonInfo.lessonDetail.weekly == 2 ? this.props.t('oddWeeks') : this.props.lessonInfo.lessonDetail.weekly == 1 ? this.props.t('evenWeeks') : this.props.t('weekly')} ${this.options.find(x => x.value === this.props.lessonInfo.lessonDetail.dayType).label} ${this.props.t('fromTime')} ${this.state.times.find(x => x.value == this.props.lessonInfo.lessonDetail.startHour).label} ${this.props.t('toTime')} `}
                        </p>
                        : null)}

                        <div className="w-full flex sm:flex-row flex-col-reverse items-center justify-center">
                            {(this.props.canEdit ?
                                    <div onClick={() => this.showDelete()} className="w-12 h-12 relative mx-1 bg-redish rounded-full cursor-pointer">
                                        {trash('w-6 text-white centerize')}
                                    </div>
                                    :
                                    null
                            )}


                            {(this.props.canEdit ?
                                    <div onClick={() => this.showEdit()} className="w-12 h-12 relative mx-1 bg-greenish rounded-full cursor-pointer">
                                        {edit('w-6 text-white centerize')}
                                    </div>
                                    :
                                    null
                            )}
                            {/* <button onClick={() => history.push("/SSO/" + this.props.lessonInfo.lessonDetail.id)} className="relative bg-greenish rounded-full text-white cursor-pointer px-3 py-2 mx-2 sm:my-0 my-2">
                                {this.props.t('enterLessonActivities')}
                            </button> */}

                            {(this.props.isTeacher ?
                                <a onClick={() => history.push("/session/" + this.props.lessonInfo.lessonDetail.id)} className="relative text-white bg-purplish rounded-full cursor-pointer px-3 py-2">
                                    {this.props.t('showClassInfo')}
                                </a>
                                : null )}
                        </div>

                        <p className="text-center text-white my-4">
                            {/* <a href={this.props.lessonInfo.lessonDetail.moodleUrl} target="_blank" className="relative w-full bg-greenish rounded-full cursor-pointer p-2">
                               ورود به فعالیت های درسی
                            </a> */}
                            {/* <form className="text-center" action="http://vs.legace.ir/login/index.php" method="POST"  >
                                <input
                                    hidden="true"
                                    name="username"
                                    type="text"
                                    placeholder="نام کاربری"
                                    value={this.props.user.userInformation.userName}
                                />
                                <input
                                    hidden="true"
                                    name="password"
                                    type="text"
                                    placeholder="رمز عبور"
                                    value={localStorage.getItem('userPassword')}
                                /> */}
                            {/* </form> */}
                        </p>

                        {/*<input type="number" name="startHour" placeholder="ساعت" onChange={this.onHandleInput} value={this.state.startHour} />*/}
                        {/*<input type="number" name="startMin" placeholder="دقیقه" onChange={this.onHandleInput} value={this.state.startMin} />*/}
                        {/*<input type="number" name="endHour" placeholder="ساعت پایان" onChange={this.onHandleInput} value={this.state.endHour} />*/}
                        {/*<input type="number" name="endMin" placeholder="دقیقه پایان" onChange={this.onHandleInput} value={this.state.endMin} />*/}
                    </div>
                </Modal>        
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {user : state.auth.userInfo}
}

const cwrapped = connect(mapStateToProps , {EditClassSchedule})(LessonInfoModal);

export default withTranslation()(cwrapped);