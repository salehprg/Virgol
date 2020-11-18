import React from 'react';
import ReactPlayer from 'react-player'

const Streamer = () => {

    return (
        <div>
            Hello
            <ReactPlayer url='https://conf.legace.ir/hls/livestream.m3u8' light controls />
        </div>
    );

}

export default Streamer;