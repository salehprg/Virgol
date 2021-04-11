import React from 'react';
import PlusTable from '../../tables/PlusTable';
import {withTranslation} from 'react-i18next'
import { connect } from 'react-redux';
import{ GetSchoolInfo , GetSchool_StudyFields ,getClassList ,addNewClass } from '../../../../_actions/schoolActions'
import AddClass from '../../baseManager/AddClass';
import { edit, loading } from '../../../../assets/icons';
import history from '../../../../history';
import SelectableCard from '../../baseManager/SelectableCard';
import {pagingItems} from '../../../Search/Seaarch'

class Sessions extends React.Component{
    state={
        loading : false ,
        showCreateModal : false ,
        sessions : [] ,
        itemsPerPage : 40 ,
        currentPage : 1 ,
        totalCard : 0
    }

    async componentDidMount(){

        this.setState({loading : true})
        await this.props.GetSchoolInfo(this.props.user.token);
        const base = this.props.schoolLessonInfo.bases.find( base => base.baseName === 'جلسات')
        await this.props.GetSchool_StudyFields(this.props.user.token , base.id)
        await this.props.getClassList(this.props.user.token , 0);


        this.setState({loading : false})

        this.setState({totalCard : this.props.classes.length})
    }

    selectSession = (id) =>{
        // console.log(id);
        history.push(`/class/${id}`)
    }

    setSessionsPagination = (currentPage = -1) => {
        const pagedItems = pagingItems(this.props.classes , (currentPage != -1 ? currentPage : this.state.currentPage) , this.state.itemsPerPage)
        this.setState({sessions : pagedItems})
    }

    paginate = (num) =>{
        this.setState({ currentPage: num })
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
                <PlusTable
                    isPaginate={true}
                    cardsPerPage={this.state.itemsPerPage}
                    totalCards={this.state.sessions}
                    paginate={this.paginate}
                    currentPage={this.state.currentPage}
                    title={this.props.t('sessionList')}
                    isLoading={this.state.loading}
                    button={() => {
                        return null;
                    }}
                    headers={[this.props.t('sessionRoom') ]}
                    body={() => {
                        return(
                            <React.Fragment>
                                {
                                    this.props.classes.map(kelass => {
                                        return(
                                            <tr>
                                                <td className="tw-text-right tw-py-4 tw-px-4">
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