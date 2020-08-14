import React from 'react';
import Modal from '../../../modals/Modal';
import DeleteConfirm from '../../../modals/DeleteConfirm';
import { edit, external_link, trash } from '../../../../assets/icons';

class LessonInfoModal extends React.Component {

    state = { selectedCourse: null, selectedTeacher: null , selectedDay : 0
             , selectedStartTime: null, selectedEndTime: null, loading : false ,
            teachers : [] , lessons : [] , showDeleteModal : false};

    componentDidMount = async () =>{


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

    times = [
        { value: 8, label: '08:00' },
        { value: 8.5, label: '08:30' },
        { value: 9, label: '09:00' },
        { value: 9.5, label: '09:30' },
        { value: 10, label: '10:00' },
        { value: 10.5, label: '10:30' },
        { value: 11, label: '11:00' },
        { value: 11.5, label: '11:30' },
        { value: 12, label: '12:00' },
        { value: 12.5, label: '12:30' },
        { value: 13, label: '13:00' },
        { value: 13.5, label: '13:30' },
        { value: 14, label: '14:00' },
        { value: 14.5, label: '14:30' },
        { value: 15, label: '15:00' },
        { value: 15.5, label: '15:30' },
        { value: 16, label: '16:00' },
        { value: 16.5, label: '16:30' },
        { value: 17, label: '17:00' },
        { value: 17.5, label: '17:30' },
        { value: 18, label: '18:00' },
        { value: 18.5, label: '18:30' },
        { value: 19, label: '19:00' },
        { value: 19.5, label: '19:30' },
        { value: 20, label: '20:00' },
        { value: 20.5, label: '20:30' },
        { value: 21, label: '21:00' },
        { value: 21.5, label: '21:30' },
        { value: 22, label: '22:00' }
    ]

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
                      
                        <p className="text-center text-white my-4">{this.props.lessonInfo.name}</p>
                        <p className="text-center text-white my-4">{this.props.lessonInfo.teachername}</p> 
                        <p className="text-center text-white my-4">
                            {`${this.props.lessonInfo.endHour} ${this.options.find(x => x.value === this.props.lessonInfo.y).label} از ساعت ${this.props.lessonInfo.startHour} تا ساعت `}
                        </p>

                        {(this.props.canEdit ?
                                <div onClick={() => this.showDelete()} className="w-12 h-12 relative bg-redish rounded-full cursor-pointer">
                                    {trash('w-6 text-white centerize')}
                                </div>
                                :
                                <p className="text-center text-white my-4">
                                    <a href={this.props.lessonInfo.moodleUrl} target="_blank" className="relative w-full bg-greenish rounded-full cursor-pointer p-2">
                                        ورود به کلاس درس
                                    </a>
                                </p>
                        )}

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

export default LessonInfoModal;