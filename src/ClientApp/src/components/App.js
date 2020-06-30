import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import history from "../history";
import AuthenticatedRoute from "./AuthenticatedRoute";
import Login from './Login';
import Dashboard from "./dashboard/teacher/Dashboard";
import SignUp from "./SignUp";

const App = (props) => {

    return (
        <div className="font-vr">
            <Router history={history}>
                <Route path="/" exact component={Login} />
                <Route path="/SignUp" exact component={SignUp} />
                <AuthenticatedRoute
                    path="/t/dashboard"
                    component={Dashboard}
                    logged={props.authenticated}
                    type={props.userType}
                />
            </Router>
        </div>
    );

}

const mapStateToProps = (state) => {
    const userType = state.auth.userInfo !== null ? state.auth.userInfo.userType : -1;
    return { authenticated: state.auth.isLogged, userType: userType};
}

export default connect(mapStateToProps)(App);