import React from 'react';
import { withTranslation } from 'react-i18next';
import ReactPlayer from 'react-player'
import { arrow_left } from '../../../assets/icons';
import history from '../../../history';
class TeacherGuide extends React.Component{ 
    render(){    
        const url = 'https://goldenstarc.arvanvod.com/0WobRajx6K/vrljPEyb37/h_,144_200,240_400,360_800,480_1500,720_2500,k.mp4.list/master.m3u8'
        return(
            <div className="tw-w-full tw-h-screen tw-bg-auto tw-bg-vst">
                <div onClick={()=> history.goBack()}>{arrow_left('tw-w-12 tw-border-2 tw-text-greenish tw-border-greenish tw-rounded-lg tw-cursor-pointer tw-mx-2 tw-p-2')}</div>
                <div className="tw-text-white tw-bg-greenish tw-w-1/2 tw-text-center tw-mx-auto tw-py-4 tw-border-4 tw-text-xl tw-border-purplish tw-rounded-lg">راهنمای سامانه ویرگول مخصوص معلمان</div>
                <ReactPlayer className="tw-mx-auto tw-py-4" url={url} width='90%' controls={true} playing={true}/>
                <form method="get" action="https://goldenstarc.arvanvod.com/0WobRajx6K/vrljPEyb37/origin_O7mAEwOJLjGTCu7iVrKTvnhqxXk6GTUdOcg8HluA.mp4">
                    <input className="tw-px-6 tw-cursor-pointer tw-bg-transparent tw-ml-4 lg:tw-ml-64 tw-py-1 tw-border-2 tw-border-sky-blue tw-text-sky-blue tw-rounded-lg tw-mx-auto" value={this.props.t('download')} type="submit"/>
                </form>
            </div>
        )
    }    
}

export default withTranslation()(TeacherGuide)