import React from 'react';
import ReactPlayer from 'react-player'

class Streamer extends React.Component {
    render () {
      return (
        <div className="w-screen relative min-h-screen meteor-bg bg-cover">
          <div className="centerize w-5/6 max-w-800">
            <ReactPlayer
              width="100%"
              height="100%"
              url={this.props.match.params.id}
              playing
              controls
            />
          </div>
        </div>
      )
    } 
  }

export default Streamer;