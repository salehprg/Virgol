import React from "react";
import {Redirect, Route} from "react-router-dom";

export default function AuthenticatedRoute({ component: C, logged, type, ...rest }) {
    console.log(type)
    return (
        <Route
            {...rest}
            render={props =>
                logged && type === 2
                    ? <C {...props}  />
                    : <Redirect
                        to={"/"}
                    />}
        />
    );
}