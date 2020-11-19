import React from 'react';
import ReactPlayer from 'react-player'

class Streamer extends React.Component {
    render () {
      return (
        <ReactPlayer
          ref={this.ref}
          onReady={this.onReady}
          url='https://conf.legace.ir/hls/livestream.m3u8'
          playing
          controls
          light
        />
      )
    } 
  }

export default Streamer;