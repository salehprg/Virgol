import React from 'react';
import { Router, Route, Link, Redirect } from 'react-router-dom';

import { history } from './_helper';
import {authenticationService} from './_Services';
import { PrivateRoute } from './_componentAuth';
import {User} from './layouts/User';
import {Admin} from './layouts/Admin';
import SignIn from './layouts/SignIn/SignIn';

const getRoute = (userType) =>{
    var Result = "";
    switch(userType)
    {
        case 0:
            Result = "/User";
            break;

        case 1:
            Result = "/User"; // Teacher
            break;

        case 2:
            Result = "/Admin";
            break
    }

    console.log("Res = " + Result + " UT = " + userType);
    return Result;
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null
        };
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({ currentUser: x }));
    }

    componentWillReceiveProps(){
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
                        <Redirect from="/login" to={getRoute(currentUser.data.userType)}></Redirect>
                    }
                    
                    <PrivateRoute path="/User" component={User}></PrivateRoute>
                    <PrivateRoute path="/Admin" component={Admin}></PrivateRoute>

                    <Route path="/login" component={SignIn} />
                    <Route exact path="/">
                        <Redirect from="/" to="/login"></Redirect>
                    </Route>
            </Router>
        );
    }
}

export default App;