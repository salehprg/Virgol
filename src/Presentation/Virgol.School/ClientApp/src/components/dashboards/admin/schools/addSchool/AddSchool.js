import React from "react";
import Add from "../../../../field/Add";
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {reduxForm, Field} from 'redux-form';
import history from "../../../../../history";
import Fieldish from '../../../../field/Fieldish';
import { check_circle } from "../../../../../assets/icons";
import ManagerGenerated from "./ManagerGenerated";

class AddSchool extends React.Component {

    state = { showManagerInfo: false }

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
                {this.state.showManagerInfo ? 
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
                : 
                <div className="p-6 border-2 border-dashed border-dark-blue">
                    {check_circle('w-1/4 mx-auto text-greenish')}
                    <p className="text-center text-greenish">
                        مدرسه جدید با موفقیت ایجاد شد. مدیر مدرسه میتواند با نام کاربری و گذرواژه زیر وارد پنل مدیریت مدرسه شود
                    </p>
                    <ManagerGenerated 
                        title="نام کاربری"
                        value="schoolManager123"
                    />
                    <ManagerGenerated 
                        title="گدرواژه"
                        value="56599561"
                    />
                    <Link className="w-full border-2 border-sky-blue text-sky-blue" to="">افزودن مقاطع، رشته ها و دروس</Link>
                </div>
                }
            </Add>
        );
    }

}

const formWrapped = reduxForm({
    form: ''
})(AddSchool);

export default connect(null)(formWrapped);