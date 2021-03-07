import React from 'react';
import { withTranslation } from 'react-i18next';
import ReactPlayer from 'react-player'
import { arrow_left } from '../../../assets/icons';
import history from '../../../history';
class TeacherGuide extends React.Component{ 
    render(){    
        const url = 'https://goldenstarc.arvanvod.com/0WobRajx6K/ka5q25YdOv/h_,144_200,240_400,360_793,480_793,720_793,1080_793,k.mp4.list/master.m3u8'
        return(
            <div className="tw-w-full tw-h-screen tw-bg-vst tw-grid tw-grid-rows-4 md:tw-grid-cols-2">
                <div>
                <div className="tw-m-4" onClick={()=> history.goBack()}>{arrow_left('tw-w-12 tw-border-2 tw-text-purplish tw-border-purplish tw-rounded-lg tw-cursor-pointer tw-mx-2 tw-p-2')}</div>
                    <div className="tw-text-white tw-mx-auto tw-w-1/2 tw-text-center tw-py-4 tw-border-4 tw-text-sm lg:tw-text-lg tw-border-purplish tw-rounded-lg">راهنمای سامانه ویرگول مخصوص معلمان</div>  
                </div>
                <div className="tw-rows-span-3">
                    <ReactPlayer className="tw-mx-auto lg:tw-mt-24 tw-mb-4" url={url} width='90%' controls={true}/>
                    <form method="get" action="https://goldenstarc.arvanvod.com/0WobRajx6K/ka5q25YdOv/origin_j2qtq32HP3qzc4bCQrlwvDJfJUXYjJ9KQE2k0BtK.mp4" className="tw-text-center">
                        <input className="tw-px-6 tw-cursor-pointer tw-bg-transparent tw-py-1 tw-border-2 tw-border-sky-blue tw-text-sky-blue tw-rounded-lg tw-mx-auto" value={this.props.t('download')} type="submit"/>
                    </form>
                </div>
            </div>
        )
    }    
}

export default withTranslation()(TeacherGuide)