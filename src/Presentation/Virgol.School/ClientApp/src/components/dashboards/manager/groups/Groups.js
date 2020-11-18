import React from 'react';
import { withTranslation } from 'react-i18next';
import PlusTable from "../../tables/PlusTable";
import { connect } from "react-redux";
import {edit, external_link, loading, trash} from "../../../../assets/icons";
import {GetMixedSchedules , DeleteMixedClassSchedule} from "../../../../_actions/classScheduleActions";
import history from "../../../../history";
import DeleteConfirm from '../../../modals/DeleteConfirm';

class Groups extends React.Component {

    state = { 
        loading: false, 
        times : [],
        query: '', 
        groups: [{ id: 1, classes: ['الف', 'ب', 'جیم'], lesson: 'حسابان 2', teacher: 'مصطفی', time: 'سه شنبه 8 - 10' }]
    }

    componentDidMount = async () => {
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

        await this.props.GetMixedSchedules(this.props.user.token);

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

    getDayName = (value) => {
        var data = this.options.find(x => x.value == value).label;

        return this.props.t(data)
    }

    showDelete = (id) => {
        this.setState({showDeleteModal : true , mixedId : id})
    }

    deleteMixedSchedule = async () => {
        await this.props.DeleteMixedClassSchedule(this.props.user.token , this.state.mixedId)
        
    }

    changeQuery = query => {
        this.setState({ query })
    }

    render() {
        return (
            <div className="w-full mt-10">
                {this.state.showDeleteModal ? 
                    <DeleteConfirm
                        title={this.props.t('deleteConfirm')}
                        confirm={this.deleteMixedSchedule}
                        cancel={() => this.setState({ showDeleteModal: false, mixedId : 0 })}
                    /> 
                    : 
                    null
                }
                <PlusTable
                    isPaginate={false}
                    title={this.props.t('groupsList')}
                    isLoading={this.state.loading}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    button={() => {
                        return (
                            <button onClick={() => history.push('/newGroup')} className="px-6 py-1 border-2 border-sky-blue text-sky-blue rounded-lg"> {this.props.t('newGroup')} </button>
                        );
                    }}
                    headers={[this.props.t('classes'), this.props.t('lesson'), this.props.t('teacher'), this.props.t('time'), '', '']}
                    body={() => {
                        return (
                            <React.Fragment>
                                {
                                    (this.props.mixedSchedules && this.state.times.length > 0 ? 
                                        this.props.mixedSchedules.map(x => {
                                            return(
                                                <tr key={x.id}>
                                                    <td className="py-4">{x.className}</td>
                                                    <td>{x.orgLessonName}</td>
                                                    <td>{`${x.firstName} ${x.lastName}`}</td>
                                                    <td>{`${x.weekly == 2 ? this.props.t('oddWeeks') : x.weekly == 1 ? this.props.t('evenWeeks') : this.props.t('weekly')} ${this.getDayName(x.dayType)} از ${this.state.times.find(y => y.value == x.startHour).label} تا ${this.state.times.find(time => time.value == x.endHour).label}` }</td>
                                                    <td className="cursor-pointer" onClick={() => history.push(`/managerNews/${x.id}`)}>
                                                        {edit('w-6 text-white')}
                                                    </td>
                                                    <td onClick={() => this.showDelete(x.mixedId)} className="cursor-pointer">
                                                        {trash('w-6 text-white ')}
                                                    </td>
                                                </tr>
                                                )
                                        })
                                    : null)
                                }
                            </React.Fragment>
                        );
                    }}
                />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , 
            mixedSchedules : state.schedules.mixedClassSchedules}
}

const cwrapped = connect (mapStateToProps, { GetMixedSchedules , DeleteMixedClassSchedule})(Groups);

export default withTranslation()(cwrapped);