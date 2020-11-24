import React from 'react';
import ReactPlayer from 'react-player'
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";

class Streamer extends React.Component {
    render () {
      return (
        <div className="w-screen relative min-h-screen meteor-bg bg-cover">
          <div className="centerize w-5/6 max-w-800">
            <ReactPlayer
              width="100%"
              height="100%"
              url={this.props.activeStream.joinLink}
              playing
              controls
            />
          </div>
        </div>
      )
    } 
  }

  const mapStateToProps = state => {
    return {user: state.auth.userInfo ,
            activeStream : state.streamData.activeStream}
}

const cwrapped = connect(mapStateToProps, { })(Streamer);

export default withTranslation()(cwrapped);