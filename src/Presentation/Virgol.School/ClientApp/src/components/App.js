import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import history from "../history";
import AuthenticatedRoute from "./AuthenticatedRoute";
import Login from './Login';
import Dashboard from "./dashboard/teacher/Dashboard";
import SignUp from "./SignUp";
import Status from "./Status";
import NoFound from "./NoFound";

const App = (props) => {

    return (
        <div className="font-vr">
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={Login} />
                    <Route path="/SignUp" exact component={SignUp} />
                    <AuthenticatedRoute
                        path="/a/dashboard"
                        component={Dashboard}
                        conditions={props.authenticated && props.userType === 2}
                        exact
                    />
                    <AuthenticatedRoute
                        path="/status"
                        component={Status}
                        conditions={props.status !== null}
                        exact
                    />
                    <Route path="" component={NoFound} />
                </Switch>
            </Router>
        </div>
    );

}

const mapStateToProps = (state) => {
    const userType = state.auth.userInfo !== null ? state.auth.userInfo.userType : -1;
    return {
        authenticated: state.auth.isLogged,
        userType: userType,
        status: state.auth.status
    };
}

export default connect(mapStateToProps)(App);