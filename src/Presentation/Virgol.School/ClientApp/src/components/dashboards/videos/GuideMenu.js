import React from 'react';
import SelectableGuide from './utils/SelectableGuide';
import studentPic from '../../../assets/pics/studenting.svg'
import teacherPic from '../../../assets/pics/teaching.svg'
import managerPic from '../../../assets/pics/managing.svg'
import { arrow_left } from '../../../assets/icons';
import history from '../../../history';
import { withTranslation } from 'react-i18next';

class GuideMenu extends React.Component {
    render(){
        return(
            <div className="tw-bg-dark-blue tw-min-h-screen">  
                <div className="tw-p-4" onClick={() => history.push('/')}>{arrow_left('tw-border-2 tw-cursor-pointer tw-border-purplish tw-p-2 tw-rounded-lg tw-text-purplish tw-w-12')}</div>
                <div className="tw-text-center">
                    <div className="tw-text-white tw-py-12 tw-text-xl">{this.props.t('chooseOneOfTheFollowingOptions')}</div>
                    <div className="tw-grid tw-grid-rows-1 tw-gap-4 lg:tw-mx-48 md:tw-mx-24 tw-mx-12 md:tw-grid-cols-3">
                        <SelectableGuide src={studentPic} extra="tw-w-5/6" title={this.props.t('studentsGuide')} type="student"/>
                        <SelectableGuide src={teacherPic} extra="tw-w-11/12" title={this.props.t('teachersGuide')} type="teacher"/>
                        <SelectableGuide src={managerPic} extra="tw-w-2/3" title={this.props.t('principalsGuide')} type="principal"/>
                    </div>
                </div>
            </div>
        )
    }
}

export default withTranslation()(GuideMenu)