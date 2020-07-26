import React, { Component } from 'react';
import { connect } from 'react-redux';

export default ChildComponent => {

    class ProtectedStatus extends Component {

        state = { condition: false }

        componentDidMount() {
            this.shouldNavigateAway();
        }

        componentDidUpdate() {
            this.shouldNavigateAway();
        }

        shouldNavigateAway() {

            const { status, history } = this.props
            if (status) {
                if (!this.state.condition) this.setState({ condition: true })
                return;
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
        return { status: state.auth.status };
    }

    return connect(mapStateToProps)(ProtectedStatus);
};