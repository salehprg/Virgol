import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import history from "../history";
import Alert from "./Alert";
import {CLEAR} from "../_actions/alertTypes";
import Working from "./Working";
import Login from "./login/Login";
import AdminDashboard from "./dashboards/admin/Dashboard";
import NoFound from "./NoFound";
import SchoolInfo from './dashboards/admin/schools/SchoolInfo'
import ManagerDashboard from './dashboards/manager/ManagerDashboard';
import AddSchool from './dashboards/admin/schools/addSchool/AddSchool';
import StudentDashboard from './dashboards/student/Dashboard';

class App extends React.Component {

    componentDidMount() {
        history.listen((location, action) => {
            this.props.dispatch({ type: CLEAR });
        });
    }

    fadeAlert = () => {
        this.props.dispatch({ type: CLEAR });
    }

    render() {
        return (
            <div className="font-vr overflow-x-hidden">
                {this.props.alert.message ? <Alert fade={this.fadeAlert} type={this.props.alert.type} message={this.props.alert.message} /> : null}
                {this.props.worker.status ? <Working /> : null}

                <Router history={history}>
                    <Switch>
                        <Route path="/" exact component={Login} />
                        <Route path="/a" component={AdminDashboard} />
                        <Route path="/school/:id" component={SchoolInfo} />
                        <Route path="/newSchool" component={AddSchool} />
                        <Route path="/m" component={ManagerDashboard} />
                        <Route path="/s" component={StudentDashboard} />
                        <Route path="" component={NoFound} />
                    </Switch>
                </Router>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        alert: state.alert,
        worker: state.worker
    };
}

export default connect(mapStateToProps)(App);