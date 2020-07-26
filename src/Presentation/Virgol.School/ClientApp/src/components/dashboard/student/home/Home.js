import React from 'react';
import { connect } from 'react-redux';
import Feed from "./Feed";
import InfoBoard from "./InfoBoard";
import Reminders from "./Reminders";

class Home extends React.Component {

    render() {
        return (
            <div className="w-full flex xl:flex-row-reverse flex-col justify-between">
                <div className="xl:w-3/5 mx-2 w-full rounded-lg h-85 bg-white overflow-auto">
                    <Feed />
                </div>

                <div className="xl:w-2/5 mx-2 w-full xl:h-85 h-auto flex flex-col justify-between items-center">
                    <InfoBoard user={this.props.user} />

                    <Reminders />
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return { user: state.auth.userInfo }
}

export default connect(mapStateToProps)(Home);