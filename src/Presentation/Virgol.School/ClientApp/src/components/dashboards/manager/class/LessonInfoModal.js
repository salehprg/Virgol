import React from 'react';
import Modal from '../../../modals/Modal';
import history from '../../../../history';
import DeleteConfirm from '../../../modals/DeleteConfirm';
import { edit, external_link, trash } from '../../../../assets/icons';
import { connect } from 'react-redux';

class LessonInfoModal extends React.Component {

    state = { selectedCourse: null, selectedTeacher: null , selectedDay : 0
             , selectedStartTime: null, selectedEndTime: null, loading : false ,
            teachers : [] , lessons : [] , showDeleteModal : false , times : []};

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
        { value: 1, label: 'شنبه' },
        { value: 2, label: 'یکشنبه' },
        { value: 3, label: 'دوشنبه' },
        { value: 4, label: 'سه شنبه' },
        { value: 5, label: 'چهار شنبه' },
        { value: 6, label: 'پنجشنبه' },
        { value: 7, label: 'جمعه' }
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

    render() {
        return (
            <React.Fragment>
                {this.state.showDeleteModal ? 
                <DeleteConfirm
                    title="آیا از عمل حذف مطمئن هستید؟ این عمل قابلیت بازگشت ندارد!"
                    confirm={() => this.props.onDelete()}
                    cancel={() => this.setState({ showDeleteModal: false})}
                /> 
                : 
                null
                }
                <Modal cancel={this.props.cancel}>
                    <div onClick={(e) => e.stopPropagation()} className="w-11/12 max-w-500 rounded-lg bg-dark-blue px-4 py-6">
                        <div>
                            <h2 className="text-center text-white my-4 text-2xl">جزییات ساعت درسی</h2>
                        </div>
                      
                        <p className="text-center text-white my-4">{this.props.lessonInfo.lessonDetail.orgLessonName}</p>
                        {(!this.props.isTeacher || this.props.isManager ? <p className="text-center text-white my-4">{this.props.lessonInfo.lessonDetail.firstName + " " + this.props.lessonInfo.lessonDetail.lastName}</p> : null )}
                        {(!this.props.isTeacher ? <p className="text-center text-white my-4">تعداد غیبت : {this.props.lessonInfo.lessonDetail.absenceCount}</p>  
                        : 
                        (!this.props.isManager ? <p className="text-center text-white my-4">مدرسه {this.props.lessonInfo.lessonDetail.schoolName} (کلاس {this.props.lessonInfo.lessonDetail.className})</p> : null)
                        )}

                        {(this.props.isManager ? <p className="text-center text-white my-4">(کلاس {this.props.lessonInfo.lessonDetail.className})</p> : null)}

                        {(this.state.times.length > 0 ?
                        <p className="text-center text-white my-4">
                            {`${this.state.times.find(x => x.value == this.props.lessonInfo.lessonDetail.endHour).label} ${this.options.find(x => x.value === this.props.lessonInfo.lessonDetail.dayType).label} از ساعت ${this.state.times.find(x => x.value == this.props.lessonInfo.lessonDetail.startHour).label} تا ساعت `}
                        </p>
                        : null)}

                        {(this.props.canEdit ?
                                <div onClick={() => this.showDelete()} className="w-12 h-12 relative bg-redish rounded-full cursor-pointer">
                                    {trash('w-6 text-white centerize')}
                                </div>
                                :
                            null
                        )}
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
                                <button onClick={() => history.push("/SSO")} className="relative w-1/2 bg-greenish rounded-full cursor-pointer p-2">
                                    ورود به فعالیت های درسی
                                </button>
                            {/* </form> */}

                            {(this.props.isTeacher ?
                            <a onClick={() => history.push("/session/" + this.props.lessonInfo.lessonDetail.id)} className="relative w-full bg-purplish rounded-full cursor-pointer p-2 mx-2">
                                نمایش دفتر کلاسی
                            </a>
                            : null )}
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

export default connect(mapStateToProps , {})(LessonInfoModal);