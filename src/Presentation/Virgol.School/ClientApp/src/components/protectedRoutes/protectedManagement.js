import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from "../../history";

export default ChildComponent => {

    class protectedManagement extends Component {

        state = { condition: false }

        componentDidMount() {
            this.shouldNavigateAway();
        }

        componentDidUpdate() {
            this.shouldNavigateAway()
        }

        shouldNavigateAway() {

            const { type } = this.props
            if (type) {
                if (type === "CoManager" || type === 'Manager') {
                    if (!this.state.condition) this.setState({ condition: true })
                    return;
                }
            }

            // history.push('/')
        }

        render() {
            return (
                <>
                    {this.state.condition && <ChildComponent {...this.props} editable={this.props.type === 'CoManager'} />}
                </>
            );
        }
    }

    const mapStateToProps = state => {
        return { type: state.auth.userType };
    }

    return connect(mapStateToProps)(protectedManagement);
};