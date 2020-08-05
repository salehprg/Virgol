import React from "react";
import Add from "../../../../field/Add";
import { connect } from 'react-redux'
import {reduxForm, Field} from 'redux-form';
import history from "../../../../../history";
import Fieldish from '../../../../field/Fieldish';

class AddSchool extends React.Component {

    renderInputs = ({ input, meta, type, placeholder }) => {
        return (
            <Fieldish
                input={input}
                redCondition={meta.touched && meta.error}
                type={type}
                dir="ltr"
                placeholder={placeholder}
                extra="w-full my-4"
            />
        );
    }

    onSubmit = (formValues) => {

    }

    render() {
        return (
            <Add 
                onCancel={() => history.push('/a/schools')}
                title="افزودن مدرسه"
            >
                <form className="w-full" onClick={this.props.handleSubmit(this.onSubmit)}>
                    <Field
                        name="name"
                        type="text"
                        placeholder="نام مدرسه"
                        component={this.renderInputs}
                    />
                    <Field
                        name="code"
                        type="text"
                        placeholder="کد مدرسه"
                        component={this.renderInputs}
                    />
                    <Field
                        name="managerFirstName"
                        type="text"
                        placeholder="نام مدیر"
                        component={this.renderInputs}
                    />
                    <Field
                        name="managerLastName"
                        type="text"
                        placeholder="نام خانوادگی مدیر"
                        component={this.renderInputs}
                    />

                    <button className="w-full py-2 mt-4 text-white bg-purplish rounded-lg">افزودن</button>
                </form>
            </Add>
        );
    }

}

const formWrapped = reduxForm({
    form: ''
})(AddSchool);

export default connect(null)(formWrapped);