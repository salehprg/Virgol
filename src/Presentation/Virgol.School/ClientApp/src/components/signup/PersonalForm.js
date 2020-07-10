import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {account, face, loading, locationIcon, person, verified} from "../../assets/icons";

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
            <div className="w-full m-auto flex flex-row-reverse flex-wrap justify-center">
                <Field
                    name="firstName"
                    placeholder="نام"
                    component={renderTextBoxes}
                    icon={face("text-golden w-6 h-6")}
                    dir="rtl"
                />
                <Field
                    name="lastName"
                    placeholder="نام خانوادگی"
                    component={renderTextBoxes}
                    icon={person("text-golden w-6 h-6")}
                    dir="rtl"
                />
                <Field
                    name="melliCode"
                    placeholder="کد ملی"
                    component={renderTextBoxes}
                    icon={verified("text-golden w-6 h-6")}
                    dir="rtl"
                />
                <Field
                    name="birthPlace"
                    placeholder="محل تولد"
                    component={renderTextBoxes}
                    icon={locationIcon("text-golden w-6 h-6")}
                    dir="rtl"
                />
                <Field
                    name="fatherName"
                    placeholder="نام پدر"
                    component={renderTextBoxes}
                    icon={account("text-golden w-6 h-6")}
                    dir="rtl"
                />
            </div>
            <button className="px-32 my-8 bg-golden hover:bg-darker-golden transition-all duration-200 flex justify-center font-vb text-xl text-dark-green py-2 rounded-lg focus:outline-none focus:shadow-outline">
                بعدی
            </button>
        </form>
    )
}

const validate = (formValues) => {
    const errors = {}

    if (!formValues.firstName) errors.firstName = true;
    if (!formValues.lastName) errors.lastName = true;
    if (!formValues.melliCode) errors.melliCode = true;
    if (!formValues.birthPlace) errors.birthPlace = true;
    if (!formValues.fatherName) errors.fatherName = true;

    return errors;
}

export default reduxForm({
    form: 'signup',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate
})(PersonalForm)