import React from 'react';
import Modal from '../../../modals/Modal';
import history from '../../../../history';
import {JoinMeeting} from '../../../../_actions/meetingActions'
import DeleteConfirm from '../../../modals/DeleteConfirm';
import { edit, external_link, trash } from '../../../../assets/icons';
import { connect } from 'react-redux';

class TrackerLessonInfo extends React.Component {

    state = { selectedCourse: null, selectedTeacher: null , selectedDay : 0
             , selectedStartTime: null, selectedEndTime: null, loading : false ,
            teachers : [] , lessons : [] , showDeleteModal : false , times : []};

    componentDidMount = async () =>{

        var times = [];
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

    joinMeeting = async (meetingId) => {
        await this.props.JoinMeeting(this.props.user.token , meetingId)
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
                        <p className="text-center text-white my-4">{this.props.lessonInfo.lessonDetail.firstName + " " + this.props.lessonInfo.lessonDetail.lastName}</p>

                        {(this.state.times.length > 0 ?
                        <p className="text-center text-white my-4">
                            {` ${this.state.times.find(x => x.value == this.props.lessonInfo.lessonDetail.endHour).label} ${this.props.lessonInfo.lessonDetail.weekly == 2 ? 'هفته های فرد' : this.props.lessonInfo.lessonDetail.weekly == 1 ? 'هفته های زوج' : 'هر هفته'} ${this.options.find(x => x.value === this.props.lessonInfo.lessonDetail.dayType).label}   از ساعت ${this.state.times.find(x => x.value == this.props.lessonInfo.lessonDetail.startHour).label} تا ساعت `}
                        </p>
                        : null)}

                        {(this.props.lessonInfo.lessonDetail.meetingId ? 
                            <>
                                <p className="text-center text-greenish text-xl my-4 rounded-full">درحال برگزاری</p>
                                <button className="w-1/2 mx-auto flex justify-center rounded-lg py-2 focus:outline-none focus:shadow-outline my-8 bg-purplish text-white" onClick={() => this.joinMeeting(this.props.lessonInfo.lessonDetail.meetingId)} >ورود به کلاس آنلاین</button>
                            </>
                        : 
                        null
                        )}

                        <p className="text-center text-white my-4">کلاس {this.props.lessonInfo.lessonDetail.className}</p>

                    </div>
                </Modal>        
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {user : state.auth.userInfo}
}

export default connect(mapStateToProps , {JoinMeeting})(TrackerLessonInfo);
