import React from "react";
import {reduxForm} from "redux-form";
import history from "../../../../../history";
import Add from "../../../../field/Add";

class BaseInfo extends React.Component {

    render() {
        return (
            <Add
                onCancel={() => history.push('/a/schools')}
                onSubmit={this.nextPage}
            >
                <form>

                </form>
            </Add>
        );
    }

}

const validate = formValues => {
    const errors = {}
    return errors;
}

export default reduxForm({
    form: 'addSchool',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate
})(BaseInfo)