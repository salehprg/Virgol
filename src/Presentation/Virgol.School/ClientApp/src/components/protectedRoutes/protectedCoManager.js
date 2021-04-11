import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from "../../history";

export default ChildComponent => {

    class protectedCoManager extends Component {

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
                if (type === "CoManager") {
                    if (!this.state.condition) this.setState({ condition: true })
                    return;
                }
            }

            // history.push('/')
        }

        render() {
            return (
                <>
                    {this.state.condition && <ChildComponent {...this.props} />}
                </>
            );
        }
    }

    const mapStateToProps = state => {
        return { type: state.auth.userType };
    }

    return connect(mapStateToProps)(protectedCoManager);
};