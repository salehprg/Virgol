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
                    appProps={ props.authenticated }
                />
            </Router>
        </div>
    );

}

const mapStateToProps = (state) => {
    return { authenticated: state.auth.isLogged };
}

export default connect(mapStateToProps)(App);