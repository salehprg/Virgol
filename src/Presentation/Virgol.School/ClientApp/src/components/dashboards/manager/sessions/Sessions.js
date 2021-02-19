import React from 'react';
import PlusTable from '../../tables/PlusTable';
import {withTranslation} from 'react-i18next'
import { connect } from 'react-redux';
import{ GetSchoolInfo , GetSchool_StudyFields ,getClassList ,addNewClass } from '../../../../_actions/schoolActions'
import AddClass from '../../baseManager/AddClass';
import { edit, loading } from '../../../../assets/icons';
import history from '../../../../history';
import SelectableCard from '../../baseManager/SelectableCard';

class Sessions extends React.Component{
    state={
        loading : false ,
        showCreateModal : false
    }

    async componentDidMount(){

        this.setState({loading : true})
        await this.props.GetSchoolInfo(this.props.user.token);
        const base = this.props.schoolLessonInfo.bases.find( base => base.baseName === 'جلسات')
        await this.props.GetSchool_StudyFields(this.props.user.token , base.id)
        await this.props.getClassList(this.props.user.token , 0);


        this.setState({loading : false})
        
    }

    onCancel = () => {
        this.setState({showCreateModal : false})
    }

    onAddSession = async (data) => {
        const requestData = {
            gradeId : 0 ,
            className : data
        };

        this.props.addNewClass(this.props.user.token , requestData)
        this.onCancel()
    }

    selectSession = (id) =>{
        // console.log(id);
        history.push(`/class/${id}`)
    }
    render() {
        return (
            
            <div className="tw-w-full tw-mt-10">
                {
                    this.state.loading ?
                    loading('tw-w-10 tw-text-grayish centerize')
                    :
                    null
                }
                {
                    this.state.showCreateModal ?
                    <AddClass
                    title={this.props.t('sessionName')}
                    cancel={this.onCancel}
                    onAddClass={this.onAddSession}/>
                    :
                    null
                }   
                <PlusTable
                    isPaginate={false}
                    title={this.props.t('sessionList')}
                    isLoading={this.state.loading}
                    button={() => {
                        return(
                            <button onClick={() => this.setState({showCreateModal : true})} className="tw-px-6 tw-py-1 tw-border-2 tw-border-sky-blue tw-text-sky-blue tw-rounded-lg">{this.props.t('newSessionRoom')}</button>
                        )
                    }}
                    headers={[this.props.t('sessionRoom') ]}
                    body={() => {
                        return(
                            <React.Fragment>
                                {
                                    this.props.classes.map(kelass => {
                                        return(
                                            <tr>
                                                <td className="tw-text-right tw-py-4">
                                                    {/* {kelass.className} */}
                                                    <SelectableCard
                                                    id={kelass.id}
                                                    title={kelass.className}
                                                    select={this.selectSession}/>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </React.Fragment>
                        )
                    }}
                />           
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {user: state.auth.userInfo , schoolLessonInfo: state.schoolData.schoolLessonInfo ,
        classes :  state.schoolData.classes}
}

const cwrapped = connect(mapStateToProps , {GetSchoolInfo , GetSchool_StudyFields  , getClassList ,addNewClass})(Sessions)

export default withTranslation()(cwrapped)