import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {account, face, locationIcon, person, phone, school, verified} from "../../assets/icons";
import Select from "react-select";

const PersonalForm = props => {

    const renderTextBoxes = ({ input, meta, placeholder, icon, dir }) => {
        return (
            <div className={`w-5/6 mx-2 max-w-300o flex px-1 flex-row py-3 my-3 items-center border ${meta.error && meta.touched ? 'border-red-600' : 'border-golden'}`}>
                <input
                    {...input}
                    className="w-full px-2 placeholder-grayish focus:outline-none"
                    type="text"
                    placeholder={placeholder}
                    dir={dir}
                />
                {icon}
            </div>
        );
    }

    const { handleSubmit } = props
    return (
        <form className="w-full h-full flex flex-col items-center" onSubmit={handleSubmit}>
            <div className="w-full m-auto flex flex-row-reverse flex-wrap justify-center items-center">
                <Field
                    name="latinFirstName"
                    placeholder="نام لاتین"
                    component={renderTextBoxes}
                    icon={face("text-golden w-6 h-6")}
                    dir="ltr"
                />
                <Field
                    name="latinLastName"
                    placeholder="نام خانوادگی لاتین"
                    component={renderTextBoxes}
                    icon={person("text-golden w-6 h-6")}
                    dir="ltr"
                />
                <Field
                    name="phoneNumber"
                    placeholder="شماره همراه"
                    component={renderTextBoxes}
                    icon={phone("text-golden w-6 h-6")}
                    dir="ltr"
                />
                <Field
                    name="fatherPhoneNumber"
                    placeholder="شماره همراه پدر"
                    component={renderTextBoxes}
                    icon={phone("text-golden w-6 h-6")}
                    dir="ltr"
                />
            </div>
            <div className="my-8 w-full flex md:flex-row flex-col justify-center items-center">
                <button type="submit" className="md:px-16 px-32 md:my-0 my-2  mx-1 bg-golden hover:bg-darker-golden transition-all duration-200 flex justify-center font-vb text-xl text-dark-green py-2 rounded-lg focus:outline-none focus:shadow-outline">
                    ثبت نام
                </button>
                <button onClick={() => props.previousPage()} type="button" className="md:px-16 px-32 md:my-0 my-2  mx-1 bg-golden hover:bg-darker-golden transition-all duration-200 flex justify-center font-vb text-xl text-dark-green py-2 rounded-lg focus:outline-none focus:shadow-outline">
                    قبلی
                </button>
            </div>
        </form>
    )
}

const validate = (formValues) => {
    const errors = {}

    if (!formValues.latinFirstName) errors.latinFirstName = true;
    if (!formValues.latinLastName) errors.latinLastName = true;
    if (!formValues.phoneNumber) errors.phoneNumber = true;
    if (!formValues.fatherPhoneNumber) errors.fatherPhoneNumber = true;

    return errors;
}

export default reduxForm({
    form: 'signup',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate
})(PersonalForm)