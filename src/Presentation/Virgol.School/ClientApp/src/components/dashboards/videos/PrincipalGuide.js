import React from 'react';
import ReactPlayer from 'react-player'
const PrincipalGuide = () => {
    const url = 'https://goldenstarc.arvanvod.com/0WobRajx6K/vrljPEyb37/h_,144_200,240_400,360_800,480_1500,720_2500,k.mp4.list/master.m3u8'


    return(
        <div className="tw-w-full tw-h-screen tw-bg-auto tw-bg-vst">
            <div className="tw-text-white tw-bg-greenish tw-w-1/2 tw-text-center tw-mx-auto tw-py-4 tw-border-4 tw-text-xl tw-border-purplish tw-rounded-lg">راهنمای سامانه ویرگول مخصوص مدیران</div>
            <ReactPlayer className="tw-mx-auto tw-py-4" url={url} width='90%' controls={true} playing={true}/>

        </div>
    )
}

export default PrincipalGuide