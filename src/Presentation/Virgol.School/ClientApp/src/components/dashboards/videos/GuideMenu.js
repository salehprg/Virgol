import React from 'react';
import SelectableGuide from './utils/SelectableGuide';
import studentPic from '../../../assets/pics/studentVector.png'
import teacherPic from '../../../assets/pics/teacherVector.png'
import managerPic from '../../../assets/pics/managerVector.png'
import { arrow_left } from '../../../assets/icons';
import history from '../../../history';

const GuideMenu = () => {
    return(
        <div className="tw-bg-dark-blue">  
            <div className="tw-p-4 tw-cursor-pointer" onClick={() => history.goBack()}>{arrow_left('tw-border-2 tw-cursor-pointer tw-border-purplish tw-p-2 tw-rounded-lg tw-text-purplish tw-w-12')}</div>
            <div className="tw-text-center">
                <div className="tw-text-white tw-py-12 tw-text-xl">یکی از گزینه های زیر را انتخاب کنید</div>
                <div className="tw-grid tw-grid-rows-3 tw-gap-4 lg:tw-mx-48 md:tw-mx-24 tw-mx-12 md:tw-grid-cols-3">
                    <SelectableGuide src={studentPic} title="راهنمای ویژه دانش آموزان" type="student"/>
                    <SelectableGuide src={teacherPic} title="راهنمای ویژه معلمان" type="teacher"/>
                    <SelectableGuide src={managerPic} title="راهنمای ویژه مدیران" type="principal"/>
                </div>
            </div>
        </div>
    )
}

export default GuideMenu