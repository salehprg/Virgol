import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {account, face, person, verified} from "../../assets/icons";

const renderTextBoxes = ({ input, meta, placeholder, icon, dir }) => {
    return (
        <div className={`w-5/6 mx-2 max-w-300o flex px-1 flex-row py-3 my-3 items-center border ${meta.error && meta.touched ? 'border-red-600' : 'border-golden'}`}>
            <span className={`bg-red-600 text-white text-sm px-3 py-1 ${meta.touched && meta.error ? 'block' : 'hidden'}`}>نامعتبر</span>
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

const PersonalForm = props => {

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
                    name="fatherName"
                    placeholder="نام پدر"
                    component={renderTextBoxes}
                    icon={account("text-golden w-6 h-6")}
                    dir="rtl"
                />
                <Field
                    name="fatherMelliCode"
                    placeholder="کد ملی پدر"
                    component={renderTextBoxes}
                    icon={verified("text-golden w-6 h-6")}
                    dir="rtl"
                />
                <Field
                    name="motherName"
                    placeholder="نام مادر"
                    component={renderTextBoxes}
                    icon={account("text-golden w-6 h-6")}
                    dir="rtl"
                />
                <Field
                    name="motherMelliCode"
                    placeholder="کد ملی مادر"
                    component={renderTextBoxes}
                    icon={verified("text-golden w-6 h-6")}
                    dir="rtl"
                />
            </div>
            <button className="px-32 my-8 bg-golden hover:bg-darker-golden transition-all duration-200 flex justify-center font-vb text-xl text-dark-green py-2 rounded-lg focus:outline-none focus:shadow-outline">
                بعدی
            </button>
        </form>
    )
}

const checkPersian = (value) => {
    return /^[پچجحخهعغآ؟.،آفقثصضشسیبلاتنمکگوئدذرزطظژ!!ؤإأءًٌٍَُِّ\s]+$/u.test(value)
}

const checkMelliCode = (value) =>{
    if (!/^\d{10}$/.test(value))
        return false;

    const check = +value[9];
    const sum = Array(9).fill().map((_, i) => +value[i] * (10 - i)).reduce((x, y) => x + y) % 11;
    return (sum < 2 && check === sum) || (sum >= 2 && check + sum === 11);
}

const validate = (formValues) => {
    const errors = {}

    if (!checkPersian(formValues.firstName)) {
        errors.firstName = true;
    }
    if (!checkPersian(formValues.lastName)) {
        errors.lastName = true;
    }
    if (!checkMelliCode(formValues.melliCode)) {
        errors.melliCode = true;
    }
    if (!checkPersian(formValues.fatherName)) {
        errors.fatherName = true;
    }
    if (!checkMelliCode(formValues.fatherMelliCode)) {
        errors.fatherMelliCode = true;
    }
    if (!checkPersian(formValues.motherName)) {
        errors.motherName = true;
    }
    if (!checkMelliCode(formValues.motherMelliCode)) {
        errors.motherMelliCode = true;
    }

    return errors;
}

export default reduxForm({
    form: 'signup',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate
})(PersonalForm)