import React from 'react';
import { Router, Route, Link, Redirect } from 'react-router-dom';

import { history } from './_helper';
import {authenticationService} from './_Services';
import { PrivateRoute } from './_componentAuth';
import {User} from './layouts/User';
import {UserCategory} from './views/UserCategory';
import {UserCourse} from './views/UserCourse';
// import {Admin} from './layouts/Admin';
import SignIn from './layouts/SignIn/SignIn';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null
        };
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({ currentUser: x }));
        console.log("test");
    }

    componentWillReceiveProps(){
        console.log("receive");
    }

    logout() {
        authenticationService.logout();
        history.push('/login');
    }

    render() {
        const { currentUser } = this.state;
        return (
            <Router history={history}>
                    {currentUser &&
                        <Redirect from="/login" to="/User"></Redirect>
                    }
                    <PrivateRoute path="/User" component={User}></PrivateRoute>
                    <Route path="/login" component={SignIn} />
            </Router>
        );
    }
}

export default App;