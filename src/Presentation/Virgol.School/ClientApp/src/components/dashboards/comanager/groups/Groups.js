import React from 'react';
import { withTranslation } from 'react-i18next';
import PlusTable from "../../tables/PlusTable";
import { connect } from "react-redux";
import {edit, external_link, loading, trash} from "../../../../assets/icons";
import {GetMixedSchedules , DeleteMixedClassSchedule} from "../../../../_actions/classScheduleActions";
import history from "../../../../history";
import DeleteConfirm from '../../../modals/DeleteConfirm';
import {pagingItems} from '../../../Search/Seaarch'

class Groups extends React.Component {

    state = { 
        loading: false, 
        times : [],
        query: '', 
        // groups: [{ id: 1, classes: ['الف', 'ب', 'جیم'], lesson: 'حسابان 2', teacher: 'مصطفی', time: 'سه شنبه 8 - 10' }]
        groups : [],
        itemsPerPage: 40, currentPage: 1 , totalCard : 0
    
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

    setPaginate = (currentPage = -1) => {
        const itemsPerPage = pagingItems(this.props.mixedSchedules , (currentPage != -1 ? currentPage : this.state.currentPage) , this.state.itemsPerPage)

        this.setState({groups : itemsPerPage})
        this.setState({totalCard : this.props.mixedSchedules.length})

    }

    paginate = (num) => {
        this.setState({ currentPage: num })
        this.setPaginate(num)
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

    changeQuery = query => {
        this.setState({ query })
    }

    render() {
        return (
            <div className="tw-w-full tw-mt-10">
                <PlusTable
                    isPaginate={true}
                    cardsPerPage={this.state.itemsPerPage}
                    totalCards={this.state.totalCard}
                    paginate={this.paginate}
                    currentPage={this.state.currentPage}
                    title={this.props.t('groupsList')}
                    isLoading={this.state.loading}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    button={() => {
                        return null;
                    }}
                    headers={[this.props.t('classes'), this.props.t('lesson'), this.props.t('teacher'), this.props.t('time')]}
                    body={() => {
                        return (
                            <React.Fragment>
                                {
                                    (this.props.mixedSchedules && this.state.times.length > 0 ? 
                                        this.props.mixedSchedules.map(x => {
                                            return(
                                                <tr key={x.id}>
                                                    <td className="tw-py-4 tw-text-right tw-px-4">{x.className}</td>
                                                    <td className="tw-text-right tw-px-4 tw-py-4">{x.orgLessonName}</td>
                                                    <td className="tw-text-right tw-px-4 tw-py-4">{`${x.firstName} ${x.lastName}`}</td>
                                                    <td className="tw-text-right tw-px-4 tw-py-4">{`${x.weekly == 2 ? this.props.t('oddWeeks') : x.weekly == 1 ? this.props.t('evenWeeks') : this.props.t('weekly')} ${this.getDayName(x.dayType)} از ${this.state.times.find(y => y.value == x.startHour).label} تا ${this.state.times.find(time => time.value == x.endHour).label}` }</td>
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