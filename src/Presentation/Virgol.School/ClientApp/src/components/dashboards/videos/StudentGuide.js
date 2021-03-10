import React from 'react';
import { withTranslation } from 'react-i18next';
import ReactPlayer from 'react-player'
import { arrow_left } from '../../../assets/icons';
import history from '../../../history';
class StudentGuide extends React.Component{ 
    render(){    
        const url = 'https://goldenstarc.arvanvod.com/0WobRajx6K/wLp0lD0DAZ/h_,144_200,240_400,360_654,480_654,720_654,1080_654,k.mp4.list/master.m3u8'
        return(
            <div className="tw-w-full tw-h-screen tw-bg-vst row">
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                    <div className="tw-m-4" onClick={()=> history.push('/video/guide-pr')}>{arrow_left('tw-w-12 tw-border-2 tw-text-purplish tw-border-purplish tw-rounded-lg tw-cursor-pointer tw-mx-2 tw-p-2')}</div>
                    <div className="tw-text-white tw-mx-auto tw-w-1/2 tw-text-center tw-py-4 tw-border-4 tw-text-sm lg:tw-text-base tw-border-purplish tw-rounded-lg">راهنمای سامانه ویرگول مخصوص دانش آموزان</div>  
                </div>
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                    <ReactPlayer className="tw-mx-auto lg:tw-mt-24 tw-mb-4" url={url} width='90%' controls={true}/>
                    <form method="get" action="https://goldenstarc.arvanvod.com/0WobRajx6K/wLp0lD0DAZ/origin_tK7e4lKVQq9RzzQJKJUDMTYAHlvtbi4i5WQn9nrW.mp4" className="tw-text-center">
                        <input className="tw-px-6 tw-cursor-pointer tw-bg-transparent tw-py-1 tw-border-2 tw-border-sky-blue tw-text-sky-blue tw-rounded-lg tw-mx-auto" value={this.props.t('download')} type="submit"/>
                    </form>
                </div>
            </div>
        )
    }    
}

export default withTranslation()(StudentGuide)