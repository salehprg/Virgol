import React from "react";
import {Redirect, Route} from "react-router-dom";

export default function AuthenticatedRoute({ component: C, conditions, ...rest }) {
    return (
        <Route
            {...rest}
            render={props =>
                conditions
                    ? <C {...props}  />
                    : <Redirect
                        to={"/"}
                    />}
        />
    );
}