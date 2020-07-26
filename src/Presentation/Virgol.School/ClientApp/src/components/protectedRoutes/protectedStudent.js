import React, { Component } from 'react';
import { connect } from 'react-redux';

export default ChildComponent => {

    class ProtectedStudent extends Component {

        state = { condition: false }

        componentDidMount() {
            this.shouldNavigateAway();
        }

        componentDidUpdate() {
            this.shouldNavigateAway();
        }

        shouldNavigateAway() {

            const { auth, history } = this.props
            if (auth) {
                if (auth.userType === 0) {
                    if (!this.state.condition) this.setState({ condition: true })
                    return;
                }
            }
            history.push('/')

        }

        render() {
            return (
                <React.Fragment>
                    {this.state.condition ? <ChildComponent {...this.props} /> : null}
                </React.Fragment>
            );
        }
    }

    function mapStateToProps(state) {
        return { auth: state.auth.userInfo };
    }

    return connect(mapStateToProps)(ProtectedStudent);
};